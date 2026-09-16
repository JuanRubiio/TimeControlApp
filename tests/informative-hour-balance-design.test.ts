import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const design = readFileSync('docs/mvp/37-balance-horas-informativo-diseno.md', 'utf8');

describe('diseño del balance de horas informativo', () => {
  it('limita el primer corte a consulta propia y niega consecuencias laborales', () => {
    expect(design).toContain('consulta exclusivamente propia');
    expect(design).toContain('no determina deuda, derecho económico, productividad, cumplimiento de convenio ni consecuencia disciplinaria');
    expect(design).toContain('No autoriza bolsa de horas, saldo exigible, compensación, cierre contable, nómina, ranking, alertas, exportación');
  });

  it('preserva la fuente versionada y excluye el día en curso', () => {
    expect(design).toContain('S5 sigue siendo propietaria de `daily_calculations`, versiones inmutables, regla y algoritmo');
    expect(design).toContain('el día actual y cualquier fecha futura quedan fuera');
    expect(design).toContain('No recibe `employeeId`, centro, empresa, zona ni instante de corte desde el navegador como autoridad');
  });

  it('distingue falta de cálculo de cero y evita recargas disruptivas', () => {
    expect(design).toContain('no transforma ausencia de fuente en cero');
    expect(design).toContain('No se usa una pantalla de “recargando”');
    expect(design).toContain('una alternativa lineal equivalente en móvil o lector de pantalla');
  });
});
