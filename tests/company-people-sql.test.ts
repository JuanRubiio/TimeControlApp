import { describe, expect, it } from 'vitest'; import { readFileSync } from 'node:fs';
const sql=readFileSync('migrations/s002_202609101000_company_people.sql','utf8');
describe('migración S2',()=>{
  it('preserva el aislamiento dedicado y el histórico laboral',()=>{expect(sql).not.toContain('tenant_id');expect(sql).toContain('environment_id uuid NOT NULL UNIQUE');expect(sql).toContain('EXCLUDE USING gist');expect(sql).toContain('deactivated_at');});
  it('limita PII y concede sólo privilegios necesarios',()=>{expect(sql).not.toContain('address');expect(sql).not.toContain('birth');expect(sql).toContain('GRANT SELECT, INSERT, UPDATE ON companies, sites, employees, employments TO mvp_app');});
});
