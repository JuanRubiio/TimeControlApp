import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
describe('migración de auditoría', () => { const sql=readFileSync('migrations/s001_202609091700_foundations.sql','utf8'); it('expone sólo un writer encadenado y revoca mutaciones ordinarias',()=>{expect(sql).toContain('CREATE OR REPLACE FUNCTION audit_append');expect(sql).toContain('pg_advisory_xact_lock');expect(sql).toContain('REVOKE INSERT, UPDATE, DELETE ON audit_entries FROM PUBLIC, mvp_app');}); it('no introduce una tabla compartida de clientes',()=>expect(sql).not.toContain('tenant_id')); });
