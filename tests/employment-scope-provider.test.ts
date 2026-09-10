import { describe, expect, it, vi } from 'vitest';
vi.mock('../src/shared/config',()=>({config:{ENVIRONMENT_ID:'00000000-0000-4000-8000-000000000099'}}));
vi.mock('../src/shared/db',()=>({db:{query:vi.fn()}}));
import { PostgresEmploymentScopeProvider, activeEmploymentContextSql } from '../src/company-people/employment-scope-provider';

const ids={employee:'00000000-0000-4000-8000-000000000001',employment:'00000000-0000-4000-8000-000000000002',company:'00000000-0000-4000-8000-000000000003',site:'00000000-0000-4000-8000-000000000004'};
describe('EmploymentScopeProvider de S2',()=>{
  it('resuelve de forma atómica los scopes de empresa y centro y la zona efectiva',async()=>{let values:unknown[]=[];const provider=new PostgresEmploymentScopeProvider(async(_sql,input)=>{values=input;return {rows:[{employmentId:ids.employment,companyId:ids.company,siteId:ids.site,effectiveTimeZone:'Europe/Madrid'}]};});await expect(provider.contextForEmployee(ids.employee,'2026-10-25T01:30:00.000Z')).resolves.toEqual({employmentId:ids.employment,companyId:ids.company,siteId:ids.site,effectiveTimeZone:'Europe/Madrid',scopes:[{type:'company',id:ids.company},{type:'site',id:ids.site}]});expect(values[0]).toBe(ids.employee);});
  it('usa la fecha local del centro para vigencia, incluso en DST, y no expone relación inexistente',async()=>{expect(activeEmploymentContextSql).toContain('AT TIME ZONE s.time_zone');const provider=new PostgresEmploymentScopeProvider(async()=>({rows:[]}));await expect(provider.contextForEmployee(ids.employee,'2026-03-29T00:30:00.000Z')).resolves.toBeNull();});
  it('rechaza una fecha local ambigua',async()=>{const provider=new PostgresEmploymentScopeProvider(async()=>({rows:[]}));await expect(provider.contextForEmployee(ids.employee,'2026-03-29T02:30:00')).rejects.toThrow('INVALID_DATETIME');});
});
