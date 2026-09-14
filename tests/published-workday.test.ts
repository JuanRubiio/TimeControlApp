import { describe,expect,it } from 'vitest';
import { publishedWorkdayForEmployee } from '../src/time-calculation/service';
import type { PublishedWorkdayDependencies } from '../src/time-calculation/service';
import type { ResolvedRule } from '../src/work-rules/contracts';

const rule:ResolvedRule={ruleId:'11111111-1111-4111-8111-111111111111',ruleVersionId:'22222222-2222-4222-8222-222222222222',scope:{type:'site',id:'33333333-3333-4333-8333-333333333333'},effectiveFrom:'2026-01-01',effectiveTo:null,timeZone:'Europe/Madrid',expectedMinutes:480,pausePolicy:{mode:'manual_visible',autoDeduct:false},calendar:{id:'44444444-4444-4444-8444-444444444444',name:'Laborable',timeZone:'Europe/Madrid',workingDays:[1,2,3,4,5],holidays:[]},shift:{id:'55555555-5555-4555-8555-555555555555',name:'Continuado',segments:[{start:'09:00',end:'17:00'}]}};
const dependencies=(overrides:Partial<PublishedWorkdayDependencies>={}):PublishedWorkdayDependencies=>({
  employmentScopeProvider:{contextForEmployee:async()=>({employmentId:'eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee',companyId:'cccccccc-cccc-4ccc-8ccc-cccccccccccc',siteId:'33333333-3333-4333-8333-333333333333',effectiveTimeZone:'Europe/Madrid',scopes:[rule.scope]})},
  ruleResolver:{resolve:async()=>rule},
  effectiveWorkday:async()=>({employeeId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',laborDate:'2026-10-25',siteId:rule.scope.id,effectiveTimeZone:'Europe/Madrid',events:[]}),
  ...overrides
});

describe('enmienda S3/S5 de jornada publicada',()=>{
  it('entrega sólo calendario/turno publicado y estado mínimo de evidencia',async()=>{
    const result=await publishedWorkdayForEmployee('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','2026-10-25T01:30:00.000Z',dependencies());
    expect(result).toEqual({laborDate:'2026-10-25',effectiveTimeZone:'Europe/Madrid',schedule:{ruleVersionId:rule.ruleVersionId,effectiveFrom:'2026-01-01',effectiveTo:null,timeZone:'Europe/Madrid',expectedMinutes:480,calendar:rule.calendar,shift:rule.shift},evidence:{status:'no_evidence',laborDate:null}});
    expect(JSON.stringify(result)).not.toContain('employeeId');
    expect(JSON.stringify(result)).not.toContain('scope');
  });
  it('conserva el día de evidencia efectiva sin inventar una jornada',async()=>{
    const result=await publishedWorkdayForEmployee('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','2026-10-25T01:30:00.000Z',dependencies({effectiveWorkday:async()=>({employeeId:'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',laborDate:'2026-10-24',siteId:rule.scope.id,effectiveTimeZone:'Europe/Madrid',events:[{id:'dddddddd-dddd-4ddd-8ddd-dddddddddddd',eventType:'clock_in',occurredAt:'2026-10-24T22:00:00.000Z',ruleVersionId:rule.ruleVersionId,siteId:rule.scope.id,laborDate:'2026-10-24',effectiveTimeZone:'Europe/Madrid'}]})}));
    expect(result?.evidence).toEqual({status:'recorded',laborDate:'2026-10-24'});
    expect(result?.laborDate).toBe('2026-10-25');
  });
  it('no produce una proyección si el empleo ya no está vigente',async()=>{
    await expect(publishedWorkdayForEmployee('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa','2026-10-25T01:30:00.000Z',dependencies({employmentScopeProvider:{contextForEmployee:async()=>null}}))).resolves.toBeNull();
  });
});
