import { describe, expect, it } from 'vitest';
import { pendingEnvironmentItems } from '../src/admin/home';

describe('inicio operativo de administración', () => {
  it('señala sólo los elementos de preparación que faltan', () => {
    expect(pendingEnvironmentItems({ company: true, sites: 1, employees: 2, employments: 2, calendars: 0, rules: 1, versions: 0 })).toEqual([
      'Calendario laboral',
      'Vigencia de regla'
    ]);
  });

  it('no convierte el estado de un módulo en una decisión desde el resumen', () => {
    expect(pendingEnvironmentItems({ company: true, sites: 1, employees: 1, employments: 1, calendars: 1, rules: 1, versions: 1, moduleStatus: 'disabled' })).toEqual([]);
  });
});
