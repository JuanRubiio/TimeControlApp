import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { assertAuthorized, AuthorizationError } from '../src/permissions/authorizer';
import { assertIdempotencyKey } from '../src/time-events/validation';

describe('S11 contratos de seguridad y privacidad', () => {
  it('mantiene autorización de auditoría en servidor y limita su consulta al entorno dedicado', () => {
    const route=readFileSync('src/app/api/v1/audit/route.ts','utf8');
    expect(()=>assertAuthorized(null,'audit.read:scope')).toThrow(AuthorizationError);
    expect(route).toContain("assertAuthorized(actor,'audit.read:scope')");
    expect(route).toContain('WHERE environment_id=$1');
    expect(route).not.toContain('device_occurred_at');
  });
  it('no admite idempotencia insuficiente que oculte dobles fichajes', () => {
    expect(()=>assertIdempotencyKey(null)).toThrow('IDEMPOTENCY_KEY_REQUIRED');
    expect(()=>assertIdempotencyKey('corta')).toThrow('IDEMPOTENCY_KEY_REQUIRED');
    expect(assertIdempotencyKey('demo-idempotency-key-0001')).toBe('demo-idempotency-key-0001');
  });
  it('no concede mutación ordinaria sobre evidencia ni auditoría', () => {
    const audit=readFileSync('migrations/s001_202609091700_foundations.sql','utf8');
    const events=readFileSync('migrations/s004_202609101500_time_events.sql','utf8');
    expect(audit).toContain('REVOKE INSERT, UPDATE, DELETE ON audit_entries FROM PUBLIC, mvp_app');
    expect(events).not.toMatch(/GRANT[^\n]*(UPDATE|DELETE) ON time_events/i);
  });
});
