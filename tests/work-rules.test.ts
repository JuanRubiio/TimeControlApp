import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { localDateAt, segments } from '../src/work-rules/validation';
import type { ResolvedRule, RuleResolver } from '../src/work-rules/contracts';

const resolved:ResolvedRule={ruleId:'11111111-1111-4111-8111-111111111111',ruleVersionId:'22222222-2222-4222-8222-222222222222',scope:{type:'site',id:'33333333-3333-4333-8333-333333333333'},effectiveFrom:'2026-01-01',effectiveTo:null,timeZone:'Europe/Madrid',expectedMinutes:480,pausePolicy:{mode:'manual_visible',autoDeduct:false},calendar:{id:'44444444-4444-4444-8444-444444444444',name:'Laborable',timeZone:'Europe/Madrid',workingDays:[1,2,3,4,5],holidays:['2026-12-25']},shift:{id:'55555555-5555-4555-8555-555555555555',name:'Partido',segments:[{start:'09:00',end:'14:00'},{start:'15:00',end:'18:00'}]}};
describe('jornada y reglas',()=>{
  it('protege solapamientos de vigencias en PostgreSQL',()=>{const sql=readFileSync('migrations/s003_202609101100_work_rules.sql','utf8');expect(sql).toContain('rule_versions_no_overlap');expect(sql).toContain("daterange(effective_from, effective_to, '[)') WITH &&");});
  it('mantiene pausas manuales, festivos explícitos y no descontables por defecto',async()=>{const mock:RuleResolver={resolve:async()=>resolved};const result=await mock.resolve({occurredAt:'2026-06-01T08:00:00.000Z',effectiveTimeZone:'Europe/Madrid',scopes:[resolved.scope]});expect(result?.pausePolicy).toEqual({mode:'manual_visible',autoDeduct:false});expect(result?.calendar?.holidays).toContain('2026-12-25');});
  it('soporta jornada partida y turno que cruza medianoche',()=>{expect(segments.safeParse([{start:'09:00',end:'14:00'},{start:'15:00',end:'18:00'}]).success).toBe(true);expect(segments.safeParse([{start:'22:00',end:'02:00'}]).success).toBe(true);});
  it('deriva la fecha laboral en medianoche y durante cambio DST',()=>{expect(localDateAt('2026-01-10T23:30:00.000Z','Europe/Madrid')).toBe('2026-01-11');expect(localDateAt('2026-03-29T00:30:00.000Z','Europe/Madrid')).toBe('2026-03-29');expect(localDateAt('2026-10-25T01:30:00.000Z','Europe/Madrid')).toBe('2026-10-25');});
  it('rechaza instantes ambiguos y zonas no IANA',()=>{expect(()=>localDateAt('2026-01-01T10:00:00','Europe/Madrid')).toThrow('INVALID_DATETIME');expect(()=>localDateAt('2026-01-01T10:00:00.000Z','CET')).toThrow('INVALID_TIME_ZONE');});
});
