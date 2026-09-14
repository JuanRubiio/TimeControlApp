import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
const roleBoundarySql=readFileSync('migrations/s028_202609141900_manager_owns_correction_decisions.sql','utf8');
const adminUi=readFileSync('src/admin/components.tsx','utf8');
const managerReview=readFileSync('src/manager/correction-review.tsx','utf8');
describe('S6 esquema aditivo',()=>{const sql=readFileSync('migrations/s006_202609101900_corrections_approvals.sql','utf8');it('conserva referencias, estados y decisiones únicas',()=>{expect(sql).toContain("status IN ('pending','approved','rejected')");expect(sql).toContain('correction_request_id uuid NOT NULL UNIQUE REFERENCES correction_requests');expect(sql).toContain('replaces_time_event_id uuid REFERENCES time_events');});it('no concede mutación de fichajes originales',()=>{expect(sql).not.toMatch(/GRANT[^\n]*(UPDATE|DELETE) ON time_events/i);expect(sql).toContain("'correction.decide'");});});
describe('límites de decisión de correcciones',()=>{it('retira el permiso decisor de Administración',()=>{expect(roleBoundarySql).toContain("r.code='admin'");expect(roleBoundarySql).toContain("'correction.decide'");});it('mantiene Administración en sólo lectura y la decisión en Responsable',()=>{expect(adminUi).not.toContain('adminApi.decide');expect(managerReview).toContain('adminApi.decide');});});
