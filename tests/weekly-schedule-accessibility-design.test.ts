import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const design = readFileSync('docs/mvp/36-cuadrante-semanal-accesible-diseno.md', 'utf8');

describe('diseño del cuadrante semanal accesible', () => {
  it('conserva el ámbito autorizado y no transforma el diseño en una nueva fuente', () => {
    expect(design).toContain('Sólo relaciones laborales vigentes de los centros que su permiso autorice');
    expect(design).toContain('no crea una fuente de verdad');
    expect(design).toContain('No aceptará desde el navegador `employeeId`, centro, empresa, plantilla o zona como autoridad');
  });

  it('ofrece equivalencia semántica, lineal y sin interacción obligatoria por puntero', () => {
    expect(design).toContain('Una tabla semántica');
    expect(design).toContain('lista lineal agrupada por persona');
    expect(design).toContain('No se exige arrastrar y soltar, selección múltiple ni interacción por puntero');
    expect(design).toContain('funcionar con teclado en 320, 390, 768 y 1280 px');
  });

  it('evita recargas disruptivas y automatismos ante conflictos', () => {
    expect(design).toContain('no muestra una pantalla de “recargando” ni desmonta la vista ya confirmada');
    expect(design).toContain('no propone resolverlo automáticamente');
  });
});
