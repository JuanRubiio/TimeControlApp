import { z } from 'zod';
import { db } from '@/shared/db';
import { config } from '@/shared/config';
import { assertAuthorized, assertSiteScope, type ScopedActor } from '@/permissions/authorizer';
import type { PersistedDailyCalculation, DailyCalculation } from '@/time-calculation/contracts';
import type { TimeEvent, TimeEventType, TimeEventMethod } from '@/time-events/contracts';
import type { AdminWorkday } from './contracts';

export const workdayQuery=z.object({
  from:z.string().date(), to:z.string().date(), employeeId:z.string().uuid().optional(),
  siteId:z.string().uuid().optional(), incident:z.enum(['all','with_incidents','without_incidents']).default('all'), detail:z.coerce.boolean().default(false)
}).refine((value)=>value.from<=value.to,{message:'El período no es válido.'});
type CalculationRow={id:string;revision:number;inputHash:string;algorithmVersion:string;sourceEventIds:string[];ruleVersionId:string;effectiveTimeZone:string;expectedMinutes:number;presenceMinutes:number;effectiveMinutes:number;registeredBreakMinutes:number;differenceMinutes:number;excessMinutes:number;incidents:DailyCalculation['incidents'];calculatedAt:Date;employeeId:string;displayName:string;laborDate:string;siteId:string;siteName:string;siteTimeZone:string};
type EventRow={id:string;employeeId:string;employmentId:string;siteId:string;ruleVersionId:string;eventType:TimeEventType;method:TimeEventMethod;occurredAt:Date;recordedAt:Date;deviceOccurredAt:Date|null;effectiveTimeZone:string;laborDate:string};
const calculationColumns=`v.id,v.revision,v.input_hash AS "inputHash",v.algorithm_version AS "algorithmVersion",v.source_event_ids AS "sourceEventIds",v.rule_version_id AS "ruleVersionId",v.effective_time_zone AS "effectiveTimeZone",v.expected_minutes AS "expectedMinutes",v.presence_minutes AS "presenceMinutes",v.effective_minutes AS "effectiveMinutes",v.registered_break_minutes AS "registeredBreakMinutes",v.difference_minutes AS "differenceMinutes",v.excess_minutes AS "excessMinutes",v.incidents,v.calculated_at AS "calculatedAt",e.id AS "employeeId",e.display_name AS "displayName",d.labor_date::text AS "laborDate",s.id AS "siteId",s.name AS "siteName",s.time_zone AS "siteTimeZone"`;
const eventColumns=`id,employee_id AS "employeeId",employment_id AS "employmentId",site_id AS "siteId",rule_version_id AS "ruleVersionId",event_type AS "eventType",method,occurred_at AS "occurredAt",recorded_at AS "recordedAt",device_occurred_at AS "deviceOccurredAt",effective_time_zone AS "effectiveTimeZone",labor_date::text AS "laborDate"`;
const calculation=(row:CalculationRow):PersistedDailyCalculation=>({id:row.id,revision:row.revision,inputHash:row.inputHash,employeeId:row.employeeId,laborDate:row.laborDate,siteId:row.siteId,ruleVersionId:row.ruleVersionId,effectiveTimeZone:row.effectiveTimeZone,sourceEventIds:row.sourceEventIds,expectedMinutes:row.expectedMinutes,presenceMinutes:row.presenceMinutes,effectiveMinutes:row.effectiveMinutes,registeredBreakMinutes:row.registeredBreakMinutes,differenceMinutes:row.differenceMinutes,excessMinutes:row.excessMinutes,excessIsInformational:true,incidents:row.incidents,algorithmVersion:row.algorithmVersion,calculatedAt:row.calculatedAt.toISOString()});
const event=(row:EventRow):TimeEvent=>({...row,occurredAt:row.occurredAt.toISOString(),recordedAt:row.recordedAt.toISOString(),deviceOccurredAt:row.deviceOccurredAt?.toISOString()??null});

export async function listWorkdays(actor:ScopedActor,input:z.infer<typeof workdayQuery>):Promise<AdminWorkday[]> {
  assertAuthorized(actor,'time-calculation.read:scope');
  if(input.siteId) assertSiteScope(actor,input.siteId);
  const params:unknown[]=[config.ENVIRONMENT_ID,input.from,input.to]; let where='';
  if(input.employeeId){params.push(input.employeeId);where+=` AND e.id=$${params.length}`;}
  if(input.siteId){params.push(input.siteId);where+=` AND s.id=$${params.length}`;}
  const scoped=actor.scopes?.filter((scope)=>scope.type==='site'&&scope.id).map((scope)=>scope.id!)??[];
  const environment=actor.scopes?.some((scope)=>scope.type==='environment');
  if(!environment){params.push(scoped);where+=` AND s.id = ANY($${params.length}::uuid[])`;}
  if(input.incident==='with_incidents')where+=' AND jsonb_array_length(v.incidents)>0';
  if(input.incident==='without_incidents')where+=' AND jsonb_array_length(v.incidents)=0';
  const rows=(await db.query<CalculationRow>(`SELECT ${calculationColumns} FROM daily_calculations d JOIN daily_calculation_versions v ON v.id=d.current_version_id JOIN employees e ON e.id=d.employee_id JOIN sites s ON s.id=d.site_id JOIN companies c ON c.id=e.company_id WHERE c.environment_id=$1 AND d.labor_date >= $2::date AND d.labor_date <= $3::date${where} ORDER BY d.labor_date DESC,e.display_name`,params)).rows;
  const results=rows.map((row):AdminWorkday=>({employee:{id:row.employeeId,displayName:row.displayName},site:{id:row.siteId,name:row.siteName,timeZone:row.siteTimeZone},calculation:calculation(row)}));
  if(input.detail) await Promise.all(results.map(async(value)=>{const rows=(await db.query<EventRow>(`SELECT ${eventColumns} FROM time_events WHERE employee_id=$1 AND labor_date=$2::date ORDER BY occurred_at,id`,[value.employee.id,value.calculation.laborDate])).rows;value.events=rows.map(event);}));
  return results;
}
