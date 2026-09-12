import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('S19 consumidor de cálculo',()=>{
  it('mantiene un cursor aditivo y el permiso mínimo de bloqueo',()=>{const cursor=readFileSync('migrations/s019_202609121100_outbox_recalculation.sql','utf8');const permission=readFileSync('migrations/s019_202609121115_outbox_consumer_permission.sql','utf8');expect(cursor).toContain('time_calculation_outbox_consumptions');expect(cursor).toContain('processed_at');expect(permission).toContain('GRANT UPDATE ON domain_event_outbox TO mvp_app');});
  it('no expone reparación por API y exige confirmación operacional',()=>{const script=readFileSync('scripts/repair-time-calculation.ts','utf8');expect(script).toContain("S19_REPAIR_CONFIRMATION!=='AUTHORIZED_REPAIR'");expect(script).toContain('S19_REPAIR_EMPLOYEE_ID');});
});
