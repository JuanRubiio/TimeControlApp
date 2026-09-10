import { describe, expect, it } from 'vitest';
import { DEMO_PROFILES, QA_TEMPORAL_CASES, demoEmployees } from './support/demo-fixtures';
import { localDateAt } from '../src/work-rules/validation';

describe('S11 fixtures y datos demo', () => {
  it('representa perfiles de entorno dedicado para pyme y empresa multicentro', () => {
    expect(DEMO_PROFILES.office.sites).toHaveLength(1);
    expect(DEMO_PROFILES.multisite.sites.length).toBeGreaterThanOrEqual(2);
    for (const profile of Object.values(DEMO_PROFILES)) expect(profile.company.name).toMatch(/Demo/);
  });
  it('sólo usa identidades y correos sintéticos, con las tres jornadas requeridas', () => {
    for (const profile of ['office','multisite'] as const) {
      const employees=demoEmployees(profile);
      expect(employees.every((item)=>item.email.endsWith('@demo.test'))).toBe(true);
      expect(new Set(employees.map((item)=>item.schedule))).toEqual(new Set(['standard','split','overnight']));
      expect(employees.every((item)=>item.displayName.startsWith('Cuenta Demo'))).toBe(true);
    }
  });
  it('documenta y verifica medianoche y ambos cambios DST mediante instantes UTC', () => {
    for (const item of QA_TEMPORAL_CASES) expect(localDateAt(item.instant,item.timeZone)).toBe(item.laborDate);
  });
});
