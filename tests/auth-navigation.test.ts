import { describe, expect, it } from 'vitest';
import { defaultDestination, loginHref, safeReturnTo } from '../src/auth/return-to';

describe('S19 navegación protegida', () => {
  it.each(['/employee', '/employee/history/2026-09-12', '/admin', '/admin/corrections/a'])('conserva sólo rutas privadas internas permitidas: %s', (value) => expect(safeReturnTo(value)).toBe(value));
  it.each(['https://attacker.test', '//attacker.test', '/\\attacker.test', '/api/v1/time-events', '/login', '/kiosk?publicKioskId=x', '/other'])('descarta retorno no permitido: %s', (value) => expect(safeReturnTo(value)).toBeNull());
  it('codifica el retorno interno al construir el login', () => expect(loginHref('/employee/history/2026-09-12')).toBe('/login?returnTo=%2Femployee%2Fhistory%2F2026-09-12'));
  it.each([[['employee'], '/employee'], [['manager'], '/admin'], [['admin'], '/admin'], [['auditor'], '/admin'], [[], '/employee']] as const)('elige el inicio correcto para el rol %j', (roles, destination) => expect(defaultDestination({ roles })).toBe(destination));
});
