import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { companyInput, employmentInput, siteInput } from '../src/company-people/schemas';
import { assertSiteScope, AuthorizationError } from '../src/permissions/authorizer';

describe('S2 validaciones de datos mínimos', () => {
  it('califica las columnas de centro en consultas con companies', () => {
    const source = readFileSync('src/company-people/service.ts', 'utf8');
    expect(source).toContain("const siteColumns = 's.id,s.company_id");
    expect(source).toContain('RETURNING ${siteReturnColumns}');
  });

  it('califica la relación laboral al unir empleados y empresa', () => {
    const source = readFileSync('src/company-people/service.ts', 'utf8');
    expect(source).toContain("const employmentSelectColumns = 'em.id");
    expect(source).toContain('SELECT ${employmentSelectColumns} FROM employments em JOIN employees e');
  });
  it('acepta empresa sin identificador legal y rechaza nombres vacíos', () => { expect(companyInput.safeParse({name:'Empresa Demo'}).success).toBe(true); expect(companyInput.safeParse({name:' '}).success).toBe(false); });
  it('exige una zona IANA de centro y un rango laboral no invertido', () => { expect(siteInput.safeParse({name:'Madrid',timeZone:'Europe/Madrid'}).success).toBe(true); expect(siteInput.safeParse({name:'Madrid',timeZone:'UTC'}).success).toBe(false); expect(siteInput.safeParse({name:'Madrid',timeZone:'Europe/CET'}).success).toBe(false); expect(employmentInput.safeParse({employeeId:'00000000-0000-4000-8000-000000000001',siteId:'00000000-0000-4000-8000-000000000002',effectiveFrom:'2026-09-10',effectiveTo:'2026-09-10'}).success).toBe(false); });
});
describe('S2 autorización de ámbitos', () => {
  it('permite el entorno completo o sólo el centro asignado', () => { expect(()=>assertSiteScope({id:'u',roles:['manager'],permissions:new Set(),scopes:[{type:'site',id:'00000000-0000-4000-8000-000000000001'}]},'00000000-0000-4000-8000-000000000001')).not.toThrow(); expect(()=>assertSiteScope({id:'u',roles:['admin'],permissions:new Set(),scopes:[{type:'environment',id:null}]},'00000000-0000-4000-8000-000000000002')).not.toThrow(); });
  it('deniega un centro ajeno', () => expect(()=>assertSiteScope({id:'u',roles:['manager'],permissions:new Set(),scopes:[{type:'site',id:'00000000-0000-4000-8000-000000000001'}]},'00000000-0000-4000-8000-000000000002')).toThrow(AuthorizationError));
});
