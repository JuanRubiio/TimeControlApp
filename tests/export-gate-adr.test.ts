import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const adr = readFileSync('docs/mvp/34-decision-piloto-y-puerta-exportacion.md', 'utf8');

describe('ADR de puerta de exportación', () => {
  it('conserva el NO-GO y no habilita una descarga visible', () => {
    expect(adr).toContain('**NO-GO para datos reales**');
    expect(adr).toContain('No se muestra botón, enlace, solicitud ni descarga de exportación');
    expect(adr).toContain('Go formal de PO');
  });

  it('se presenta como propuesta, no como decisión asumida', () => {
    expect(adr).toContain('propuesta para decisión de PO');
    expect(adr).toContain('PO debe aceptar, rechazar o enmendar esta recomendación');
  });
});
