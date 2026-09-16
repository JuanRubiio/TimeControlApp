import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const design = readFileSync('docs/mvp/39-tipologias-ausencia-configurables-versionadas.md', 'utf8');

describe('refinamiento de tipologías de ausencia versionadas', () => {
  it('preserva la instantánea histórica y evita una categoría libre', () => {
    expect(design).toContain('no hay alta de claves, texto libre ni importación');
    expect(design).toContain('no reescribe ni borra la anterior');
    expect(design).toContain('la lectura histórica conserva su instantánea');
  });

  it('mantiene separados los módulos, los permisos y los dominios de jornada', () => {
    expect(design).toContain('crear solicitudes exige además que el módulo esté `active`, RBAC, ámbito, relación vigente');
    expect(design).toContain('No se escribe ni lee `time_events`, correcciones S6, reglas S3, cálculos S5');
    expect(design).toContain('No hay aprobación automática, reglas de elegibilidad, alertas, notificaciones');
  });

  it('deja el desarrollo bloqueado hasta que las decisiones y revisiones sean trazables', () => {
    expect(design).toContain('#89 permanece en **Refinamiento** y no satisface la Definition of Ready');
    expect(design).toContain('S15 conserva el NO-GO de datos reales');
  });
});
