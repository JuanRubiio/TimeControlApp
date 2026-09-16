import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const adr = readFileSync('docs/mvp/adr-0008-modulos-rrhh-activables.md', 'utf8');

describe('ADR de módulos de RR. HH.', () => {
  it('separa activación de empresa, RBAC y ámbito', () => {
    expect(adr).toContain('RBAC responde quién puede hacer una acción; no responde si una empresa ha adoptado el módulo');
    expect(adr).toContain('Una operación futura se permite únicamente cuando se cumplen todas las puertas');
    expect(adr).toContain('Sólo Administración puede transitar');
  });

  it('preserva evidencia y niega el acceso directo cuando el módulo no está activo', () => {
    expect(adr).toContain('Las APIs, acciones de servidor y rutas deben llamar al resolvedor de módulo');
    expect(adr).toContain('nunca reescribe el pasado');
    expect(adr).toContain('No se crea una bandera genérica en el navegador');
  });
});
