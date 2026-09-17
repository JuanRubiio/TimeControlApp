import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const migration = readFileSync('migrations/s033_202609161830_shift_planning_foundation.sql', 'utf8');
const centerMigration = readFileSync('migrations/s034_202609171200_shift_planning_centers.sql', 'utf8');
const permissions = readFileSync('src/permissions/catalog.ts', 'utf8');

describe('fundación de planificación futura', () => {
  it('mantiene shift_planning desactivado por defecto y reservado a Administración', () => {
    expect(migration).toContain("module_key IN ('shift_planning','informative_hour_balance','leave_management')");
    expect(migration).toContain("status text NOT NULL DEFAULT 'disabled'");
    expect(migration).toContain("WHERE r.code='admin'");
    expect(permissions).toContain("'shift-planning.write'");
  });

  it('conserva una instantánea y rechaza solapes publicados', () => {
    expect(migration).toContain('template_snapshot jsonb NOT NULL');
    expect(migration).toContain('planned_shift_assignments_no_published_overlap');
    expect(migration).toContain("WHERE (status='published')");
  });

  it('no acopla la planificación a fichajes ni cálculos', () => {
    expect(migration).not.toContain('time_events');
    expect(migration).not.toContain('daily_calculation');
    expect(migration).not.toContain('rule_versions');
  });

  it('separa el catálogo de Administración de la publicación por centro', () => {
    expect(centerMigration).toContain('planned_shift_template_sites');
    expect(centerMigration).toContain("'shift-planning.publish:scope'");
    expect(centerMigration).toContain("WHERE r.code='manager'");
    expect(permissions).toContain("'shift-planning.publish:scope'");
  });
});
