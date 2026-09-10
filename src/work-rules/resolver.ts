import { db } from '@/shared/db';
import type { ResolvedRule, RuleResolver, RuleResolverInput, RuleScope } from './contracts';
import { localDateAt } from './validation';
type Row = { ruleId:string; ruleVersionId:string; scopeType:RuleScope['type']; scopeId:string; effectiveFrom:string; effectiveTo:string|null; timeZone:string; expectedMinutes:number; pausePolicy:ResolvedRule['pausePolicy']; calendar:any; shift:any };
const priority: Record<RuleScope['type'],number>={site:0,collective:1,company:2};
export class PostgresRuleResolver implements RuleResolver {
  async resolve(input:RuleResolverInput):Promise<ResolvedRule|null> {
    const day=localDateAt(input.occurredAt,input.effectiveTimeZone); if (!input.scopes.length) return null;
    const types=input.scopes.map(s=>s.type), ids=input.scopes.map(s=>s.id);
    const result=await db.query<Row>(`SELECT wr.id AS "ruleId",rv.id AS "ruleVersionId",wr.scope_type AS "scopeType",wr.scope_id AS "scopeId",rv.effective_from::text AS "effectiveFrom",rv.effective_to::text AS "effectiveTo",rv.time_zone AS "timeZone",rv.expected_minutes AS "expectedMinutes",rv.pause_policy AS "pausePolicy",rv.calendar_snapshot AS calendar,rv.shift_snapshot AS shift FROM work_rules wr JOIN rule_versions rv ON rv.work_rule_id=wr.id WHERE wr.status='active' AND (wr.scope_type,wr.scope_id) IN (SELECT * FROM unnest($1::text[],$2::uuid[])) AND rv.effective_from <= $3::date AND (rv.effective_to IS NULL OR rv.effective_to > $3::date)`,[types,ids,day]);
    const row=result.rows.sort((a,b)=>priority[a.scopeType]-priority[b.scopeType])[0];
    return row ? {ruleId:row.ruleId,ruleVersionId:row.ruleVersionId,scope:{type:row.scopeType,id:row.scopeId},effectiveFrom:row.effectiveFrom,effectiveTo:row.effectiveTo,timeZone:row.timeZone,expectedMinutes:row.expectedMinutes,pausePolicy:row.pausePolicy,calendar:row.calendar,shift:row.shift} : null;
  }
}
export class FixedRuleResolver implements RuleResolver { constructor(private readonly rule:ResolvedRule|null) {} async resolve(){return this.rule;} }
