import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('detalle administrativo de corrección', () => {
  it('mantiene Administración en consulta de trazabilidad', () => {
    const source = readFileSync('src/admin/components.tsx', 'utf8');
    expect(source).toContain('Consulta de evidencia y decisiones registradas');
    expect(source).not.toContain('adminApi.decide');
    expect(source).not.toContain('Aprobar corrección');
  });
});
