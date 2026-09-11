import { describe, expect, it } from 'vitest';
import { isLocalSyntheticDemoMfaBypassEnabled } from '../src/auth/service';

describe('bypass MFA de demo local', () => {
  const base = { enabled: true, sessionCookieSecure: false, email: 'admin.office@demo.test', roles: ['admin'] };
  it('sólo permite la cuenta administrativa sintética en HTTP local', () => expect(isLocalSyntheticDemoMfaBypassEnabled(base)).toBe(true));
  it.each([
    { ...base, enabled: false },
    { ...base, sessionCookieSecure: true },
    { ...base, email: 'admin@empresa.test' },
    { ...base, roles: ['manager'] }
  ])('rechaza una condición fuera del límite', (input) => expect(isLocalSyntheticDemoMfaBypassEnabled(input)).toBe(false));
});
