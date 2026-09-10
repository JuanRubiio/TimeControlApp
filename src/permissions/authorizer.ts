import type { Permission } from './catalog';
export type Actor = { id: string; permissions: ReadonlySet<string>; roles: readonly string[] };
export type AssignmentScope = { type: 'self' | 'site' | 'environment'; id: string | null };
export type ScopedActor = Actor & { scopes?: readonly AssignmentScope[] };
export class AuthorizationError extends Error { }
export function assertAuthorized(actor: Actor | null, permission: Permission): asserts actor is Actor {
  if (!actor || !actor.permissions.has(permission)) throw new AuthorizationError('FORBIDDEN');
}
export function assertSiteScope(actor: ScopedActor, siteId: string): void {
  const allowed = actor.scopes?.some((scope) => scope.type === 'environment' || (scope.type === 'site' && scope.id === siteId));
  if (!allowed) throw new AuthorizationError('FORBIDDEN');
}
