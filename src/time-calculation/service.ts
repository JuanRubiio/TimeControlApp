import { createHash } from 'node:crypto';
import type pg from 'pg';
import { appendAudit } from '@/audit/audit-writer';
import { db } from '@/shared/db';
import { config } from '@/shared/config';
import { calculateDaily } from './algorithm';
import type { CalculationEvent, DailyCalculation, EffectiveWorkday, EffectiveWorkdayEvent, PersistedDailyCalculation } from './contracts';
import type { ResolvedRule } from '@/work-rules/contracts';
import { PostgresEmploymentScopeProvider } from '@/company-people/rule-scopes';
import { localDateAt } from '@/work-rules/validation';

type EventRow={id:string;eventType:CalculationEvent['eventType'];occurredAt:Date;ruleVersionId:string;laborDate:string;siteId:string};
type VersionRow={id:string;revision:number;inputHash:string;algorithmVersion:string;sourceEventIds:string[];ruleVersionId:string;effectiveTimeZone:string;expectedMinutes:number;presenceMinutes:number;effectiveMinutes:number;registeredBreakMinutes:number;differenceMinutes:number;excessMinutes:number;incidents:DailyCalculation['incidents'];calculatedAt:Date;employeeId:string;laborDate:string;siteId:string};
const hash=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const iso=(value:Date)=>value.toISOString();
function saved(row:VersionRow):PersistedDailyCalculation{return {id:row.id,revision:row.revision,inputHash:row.inputHash,employeeId:row.employeeId,laborDate:row.laborDate,siteId:row.siteId,ruleVersionId:row.ruleVersionId,effectiveTimeZone:row.effectiveTimeZone,sourceEventIds:row.sourceEventIds,expectedMinutes:row.expectedMinutes,presenceMinutes:row.presenceMinutes,effectiveMinutes:row.effectiveMinutes,registeredBreakMinutes:row.registeredBreakMinutes,differenceMinutes:row.differenceMinutes,excessMinutes:row.excessMinutes,excessIsInformational:true,incidents:row.incidents,algorithmVersion:row.algorithmVersion,calculatedAt:iso(row.calculatedAt)};}
const versionColumns=`v.id,v.revision,v.input_hash AS "inputHash",v.algorithm_version AS "algorithmVersion",v.source_event_ids AS "sourceEventIds",v.rule_version_id AS "ruleVersionId",v.effective_time_zone AS "effectiveTimeZone",v.expected_minutes AS "expectedMinutes",v.presence_minutes AS "presenceMinutes",v.effective_minutes AS "effectiveMinutes",v.registered_break_minutes AS "registeredBreakMinutes",v.difference_minutes AS "differenceMinutes",v.excess_minutes AS "excessMinutes",v.incidents,v.calculated_at AS "calculatedAt",d.employee_id AS "employeeId",d.labor_date::text AS "laborDate",d.site_id AS "siteId"`;

function selectDayEvents(rows:EventRow[], laborDate:string):EventRow[] {
  const ordered=[...rows].sort((a,b)=>a.occurredAt.getTime()-b.occurredAt.getTime()||a.id.localeCompare(b.id)); const selected:EventRow[]=[]; let open=false;
  for(const row of ordered){
    if(row.eventType==='clock_in' && row.laborDate===laborDate) { open=true; selected.push(row); continue; }
    if(open) { selected.push(row); if(row.eventType==='clock_out') open=false; }
    else if(row.laborDate===laborDate) selected.push(row);
  }
  return selected;
}
async function effectiveEvents(employeeId:string,laborDate:string):Promise<EventRow[]> {
  const raw=(await db.query<EventRow>(`SELECT * FROM (
    SELECT t.id,t.event_type AS "eventType",t.occurred_at AS "occurredAt",t.rule_version_id AS "ruleVersionId",t.labor_date::text AS "laborDate",t.site_id AS "siteId"
    FROM time_events t WHERE t.employee_id=$1 AND t.labor_date >= $2::date AND t.labor_date < ($2::date + interval '3 days')
      AND NOT EXISTS (SELECT 1 FROM correction_effects ce WHERE ce.replaces_time_event_id=t.id)
    UNION ALL
    SELECT ce.id,ce.event_type AS "eventType",ce.occurred_at AS "occurredAt",ce.rule_version_id AS "ruleVersionId",ce.labor_date::text AS "laborDate",ce.site_id AS "siteId"
    FROM correction_effects ce WHERE ce.employee_id=$1 AND ce.labor_date >= $2::date AND ce.labor_date < ($2::date + interval '3 days')
  ) sources ORDER BY "occurredAt",id`,[employeeId,laborDate])).rows;
  return selectDayEvents(raw,laborDate);
}

/** Contrato público S5: evidencia efectiva mínima para una jornada abierta, sin mutaciones. */
export async function effectiveWorkday(employeeId:string,asOf:string):Promise<EffectiveWorkday|null>{
  const employment=await new PostgresEmploymentScopeProvider().contextForEmployee(employeeId,asOf);
  if(!employment)return null;
  const laborDate=localDateAt(asOf,employment.effectiveTimeZone);
  const events=await effectiveEvents(employeeId,laborDate);
  const first=events[0];
  return {employeeId,laborDate,siteId:first?.siteId??employment.siteId,effectiveTimeZone:first?.siteId?employment.effectiveTimeZone:employment.effectiveTimeZone,events:events.map((event):EffectiveWorkdayEvent=>({...event,occurredAt:iso(event.occurredAt),effectiveTimeZone:employment.effectiveTimeZone}))};
}
async function ruleForVersion(client:pg.PoolClient,ruleVersionId:string):Promise<ResolvedRule|null>{
  const q=await client.query<any>(`SELECT wr.id AS "ruleId",rv.id AS "ruleVersionId",wr.scope_type AS "scopeType",wr.scope_id AS "scopeId",rv.effective_from::text AS "effectiveFrom",rv.effective_to::text AS "effectiveTo",rv.time_zone AS "timeZone",rv.expected_minutes AS "expectedMinutes",rv.pause_policy AS "pausePolicy",rv.calendar_snapshot AS calendar,rv.shift_snapshot AS shift FROM rule_versions rv JOIN work_rules wr ON wr.id=rv.work_rule_id WHERE rv.id=$1`,[ruleVersionId]);
  const row=q.rows[0]; return row?{ruleId:row.ruleId,ruleVersionId:row.ruleVersionId,scope:{type:row.scopeType,id:row.scopeId},effectiveFrom:row.effectiveFrom,effectiveTo:row.effectiveTo,timeZone:row.timeZone,expectedMinutes:row.expectedMinutes,pausePolicy:row.pausePolicy,calendar:row.calendar,shift:row.shift}:null;
}
export async function employeeSite(employeeId:string,laborDate:string){const q=await db.query<{siteId:string}>(`SELECT COALESCE(d.site_id, e.site_id, em.site_id) AS "siteId" FROM employees p JOIN companies c ON c.id=p.company_id LEFT JOIN daily_calculations d ON d.employee_id=p.id AND d.labor_date=$2 LEFT JOIN LATERAL (SELECT site_id FROM time_events WHERE employee_id=p.id AND labor_date=$2 ORDER BY occurred_at,id LIMIT 1) e ON true LEFT JOIN LATERAL (SELECT site_id FROM employments WHERE employee_id=p.id AND effective_from <= $2::date AND (effective_to IS NULL OR effective_to>$2::date) ORDER BY effective_from DESC LIMIT 1) em ON true WHERE p.id=$1 AND p.is_active AND c.is_active AND c.environment_id=$3`,[employeeId,laborDate,config.ENVIRONMENT_ID]);return q.rows[0]?.siteId??null;}
export async function currentCalculation(employeeId:string,laborDate:string):Promise<PersistedDailyCalculation|null>{const q=await db.query<VersionRow>(`SELECT ${versionColumns} FROM daily_calculations d JOIN daily_calculation_versions v ON v.id=d.current_version_id WHERE d.employee_id=$1 AND d.labor_date=$2`,[employeeId,laborDate]);return q.rows[0]?saved(q.rows[0]):null;}

export async function recalculateDaily(employeeId:string,laborDate:string,actorId:string,correlationId:string):Promise<{calculation:PersistedDailyCalculation;replayed:boolean}>{
  const client=await db.connect(); try{await client.query('BEGIN'); await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 505))',[`${employeeId}:${laborDate}`]);
    // S6 aporta efectos aprobados como evidencia aditiva. La fuente S4 sigue intacta;
    // cuando un efecto sustituye un evento, éste sólo queda fuera de esta proyección.
    const raw=(await client.query<EventRow>(`SELECT * FROM (
      SELECT t.id,t.event_type AS "eventType",t.occurred_at AS "occurredAt",t.rule_version_id AS "ruleVersionId",t.labor_date::text AS "laborDate",t.site_id AS "siteId"
      FROM time_events t WHERE t.employee_id=$1 AND t.labor_date >= $2::date AND t.labor_date < ($2::date + interval '3 days')
        AND NOT EXISTS (SELECT 1 FROM correction_effects ce WHERE ce.replaces_time_event_id=t.id)
      UNION ALL SELECT ce.id,ce.event_type AS "eventType",ce.occurred_at AS "occurredAt",ce.rule_version_id AS "ruleVersionId",ce.labor_date::text AS "laborDate",ce.site_id AS "siteId" FROM correction_effects ce WHERE ce.employee_id=$1 AND ce.labor_date >= $2::date AND ce.labor_date < ($2::date + interval '3 days')
    ) sources ORDER BY "occurredAt",id`,[employeeId,laborDate])).rows;
    const selected=selectDayEvents(raw,laborDate); if(!selected.length) throw new Error('CALCULATION_SOURCE_EMPTY');
    const first=selected.find((event)=>event.eventType==='clock_in')??selected[0]; const rule=await ruleForVersion(client,first.ruleVersionId); if(!rule) throw new Error('RULE_VERSION_UNRESOLVABLE');
    await client.query(`INSERT INTO calculation_policies(rule_version_id,created_by_user_id) VALUES($1,$2) ON CONFLICT(rule_version_id) DO NOTHING`,[rule.ruleVersionId,actorId]);
    const policy=(await client.query<{threshold:number}>('SELECT excess_threshold_minutes AS threshold FROM calculation_policies WHERE rule_version_id=$1',[rule.ruleVersionId])).rows[0];
    const calculation=calculateDaily({employeeId,laborDate,siteId:first.siteId,events:selected.map((event)=>({...event,occurredAt:iso(event.occurredAt)})),rule,excessThresholdMinutes:policy.threshold});
    const inputHash=hash({events:calculation.sourceEventIds,ruleVersionId:rule.ruleVersionId,rule:{timeZone:rule.timeZone,expectedMinutes:rule.expectedMinutes,calendar:rule.calendar,shift:rule.shift,pausePolicy:rule.pausePolicy},excessThresholdMinutes:policy.threshold,algorithmVersion:calculation.algorithmVersion});
    const existing=await client.query<VersionRow>(`SELECT ${versionColumns} FROM daily_calculations d JOIN daily_calculation_versions v ON v.daily_calculation_id=d.id WHERE d.employee_id=$1 AND d.labor_date=$2 AND v.input_hash=$3`,[employeeId,laborDate,inputHash]);
    if(existing.rowCount){await client.query('COMMIT');return {calculation:saved(existing.rows[0]),replayed:true};}
    const daily=(await client.query<{id:string;revision:number}>(`INSERT INTO daily_calculations(employee_id,labor_date,site_id,rule_version_id,effective_time_zone) VALUES($1,$2,$3,$4,$5) ON CONFLICT(employee_id,labor_date) DO UPDATE SET site_id=EXCLUDED.site_id,rule_version_id=EXCLUDED.rule_version_id,effective_time_zone=EXCLUDED.effective_time_zone,updated_at=clock_timestamp() RETURNING id,current_revision AS revision`,[employeeId,laborDate,calculation.siteId,rule.ruleVersionId,rule.timeZone])).rows[0];
    const version=(await client.query<VersionRow>(`INSERT INTO daily_calculation_versions(daily_calculation_id,revision,input_hash,algorithm_version,source_event_ids,rule_version_id,effective_time_zone,expected_minutes,presence_minutes,effective_minutes,registered_break_minutes,difference_minutes,excess_minutes,incidents) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING id,revision,input_hash AS "inputHash",algorithm_version AS "algorithmVersion",source_event_ids AS "sourceEventIds",rule_version_id AS "ruleVersionId",effective_time_zone AS "effectiveTimeZone",expected_minutes AS "expectedMinutes",presence_minutes AS "presenceMinutes",effective_minutes AS "effectiveMinutes",registered_break_minutes AS "registeredBreakMinutes",difference_minutes AS "differenceMinutes",excess_minutes AS "excessMinutes",incidents,calculated_at AS "calculatedAt"`,[daily.id,daily.revision+1,inputHash,calculation.algorithmVersion,JSON.stringify(calculation.sourceEventIds),rule.ruleVersionId,rule.timeZone,calculation.expectedMinutes,calculation.presenceMinutes,calculation.effectiveMinutes,calculation.registeredBreakMinutes,calculation.differenceMinutes,calculation.excessMinutes,JSON.stringify(calculation.incidents)])).rows[0];
    await client.query('UPDATE daily_calculations SET current_version_id=$2,current_revision=$3,calculated_at=clock_timestamp(),updated_at=clock_timestamp() WHERE id=$1',[daily.id,version.id,version.revision]);
    const result=saved({...version,employeeId,laborDate,siteId:calculation.siteId}); await appendAudit({actorType:'user',actorId,action:'time-calculation.recalculated',resourceType:'daily-calculation',resourceId:daily.id,result:'success',correlationId,changes:{employeeId,laborDate,ruleVersionId:rule.ruleVersionId,revision:version.revision,incidentCodes:calculation.incidents.map(i=>i.code)}});
    await client.query('COMMIT'); return {calculation:result,replayed:false};
  }catch(error){await client.query('ROLLBACK').catch(()=>undefined);throw error;}finally{client.release();}
}

/** Una política sólo puede modificarse antes de que una versión de regla tenga resultados históricos. */
export async function configureExcessPolicy(ruleVersionId:string,excessThresholdMinutes:number,actorId:string,correlationId:string){
  const client=await db.connect();try{await client.query('BEGIN');const exists=await client.query('SELECT id FROM rule_versions WHERE id=$1',[ruleVersionId]);if(!exists.rowCount)throw new Error('RULE_VERSION_UNRESOLVABLE');const used=await client.query('SELECT 1 FROM daily_calculation_versions WHERE rule_version_id=$1 LIMIT 1',[ruleVersionId]);if(used.rowCount)throw new Error('CALCULATION_POLICY_LOCKED');const value=(await client.query<{threshold:number}>(`INSERT INTO calculation_policies(rule_version_id,excess_threshold_minutes,created_by_user_id) VALUES($1,$2,$3) ON CONFLICT(rule_version_id) DO UPDATE SET excess_threshold_minutes=EXCLUDED.excess_threshold_minutes,created_by_user_id=EXCLUDED.created_by_user_id RETURNING excess_threshold_minutes AS threshold`,[ruleVersionId,excessThresholdMinutes,actorId])).rows[0];await appendAudit({actorType:'user',actorId,action:'time-calculation.policy.configured',resourceType:'calculation-policy',resourceId:ruleVersionId,result:'success',correlationId,changes:{excessThresholdMinutes}});await client.query('COMMIT');return {ruleVersionId,excessThresholdMinutes:value.threshold};}catch(error){await client.query('ROLLBACK').catch(()=>undefined);throw error;}finally{client.release();}
}
