import type { Permission } from './catalog';
export type Actor = { id: string; permissions: ReadonlySet<string>; roles: readonly string[] };
export class AuthorizationError extends Error { }
export function assertAuthorized(actor: Actor | null, permission: Permission): asserts actor is Actor {
  if (!actor || !actor.permissions.has(permission)) throw new AuthorizationError('FORBIDDEN');
}
