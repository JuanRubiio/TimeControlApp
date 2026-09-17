import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const design = readFileSync('docs/mvp/35-plantillas-turno-y-asignaciones-versionadas.md', 'utf8');

describe('diseño de plantillas y asignaciones de turno', () => {
  it('preserva una instantánea fechada y no modifica S3/S5 implícitamente', () => {
    expect(design).toContain('instantánea completa de una versión de plantilla');
    expect(design).toContain('No cambia el resultado de `RuleResolver`');
    expect(design).toContain('ningún consumidor puede decidir su propia prioridad');
  });

  it('rechaza conflictos y cambios retroactivos sin automatizarlos', () => {
    expect(design).toContain('Nunca se resuelve cortando, fusionando, desplazando, borrando ni priorizando automáticamente');
    expect(design).toContain('No se puede publicar, cancelar ni sustituir una asignación cuyo inicio ya haya transcurrido');
    expect(design).toContain('Responsable | Publicar asignaciones futuras sólo para relaciones vigentes de sus centros');
  });
});
