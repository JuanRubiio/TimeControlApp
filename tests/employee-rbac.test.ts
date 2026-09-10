import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('S14 permisos mínimos de empleado', () => {
  it('otorga sólo las acciones propias necesarias para fichar, consultar y corregir', () => {
    const migration=readFileSync('migrations/s014_202609102350_employee_self_service_permissions.sql','utf8');
    for (const permission of ['employee.read:self','time-event.create:self','time-event.read:self','time-calculation.read:self','correction.create:self','correction.read:self']) expect(migration).toContain(`'${permission}'`);
    expect(migration).toContain("WHERE r.code = 'employee'");
    expect(migration).not.toContain('time-event.read:scope');
    expect(migration).not.toContain('correction.decide');
  });

  it('revoca exportaciones de ámbito porque no son permisos de autoconsulta', () => {
    const migration=readFileSync('migrations/s014_202609102355_revoke_employee_scope_exports.sql','utf8');
    expect(migration).toContain("WHERE role_id = (SELECT id FROM roles WHERE code = 'employee')");
    expect(migration).toContain("'export.create:scope'");
    expect(migration).toContain("'export.read:scope'");
  });
});
