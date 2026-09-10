import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
const sql=readFileSync('migrations/s005_202609101800_time_calculations.sql','utf8');
describe('migración S5',()=>{
  it('mantiene evidencia fuente y versiones de cálculo sin tocar fichajes',()=>{expect(sql).toContain('daily_calculation_versions');expect(sql).toContain('source_event_ids jsonb NOT NULL');expect(sql).toContain('UNIQUE(daily_calculation_id, input_hash)');expect(sql).not.toMatch(/UPDATE\s+time_events|DELETE\s+FROM\s+time_events/i);});
  it('marca el exceso como informativo y conserva aislamiento por entorno dedicado',()=>{expect(sql).toContain('excess_is_informational boolean NOT NULL DEFAULT true');expect(sql).not.toContain('tenant_id');expect(sql).toContain("'time-calculation.read:scope'");});
  it('permite concurrencia idempotente por jornada mediante clave única y versión',()=>{expect(sql).toContain('UNIQUE(employee_id, labor_date)');expect(sql).toContain('UNIQUE(daily_calculation_id, revision)');expect(sql).toContain('calculation_policies');});
});
