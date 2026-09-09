import { describe, expect, it } from 'vitest';
import { assertAuthorized, AuthorizationError } from '../src/permissions/authorizer';
describe('autorización en servidor', () => {
  it('deniega por defecto', () => expect(() => assertAuthorized(null, 'audit.read:scope')).toThrow(AuthorizationError));
  it('no confunde rol de UI con permiso efectivo', () => expect(() => assertAuthorized({id:'u',roles:['admin'],permissions:new Set()}, 'audit.read:scope')).toThrow(AuthorizationError));
  it('permite sólo el permiso explícito', () => expect(() => assertAuthorized({id:'u',roles:['auditor'],permissions:new Set(['audit.read:scope'])}, 'audit.read:scope')).not.toThrow());
});
