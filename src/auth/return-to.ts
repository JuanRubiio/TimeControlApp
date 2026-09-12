const allowedPrefixes = ['/employee', '/admin'] as const;

type RoleCarrier = { roles: readonly string[] } | null | undefined;

/** The role landing is a usability default; page/API authorization remains server-side. */
export function defaultDestination(actor: RoleCarrier): '/employee' | '/admin' {
  return actor?.roles.some((role) => ['admin', 'manager', 'auditor'].includes(role)) ? '/admin' : '/employee';
}

/**
 * A return location is deliberately a small, internal allowlist.  It is
 * shared by the page guard and the login UI so a browser supplied value can
 * never become an open redirect.
 */
export function safeReturnTo(value: string | null | undefined): string | null {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return null;
  if (value.includes('://') || value.startsWith('/api/') || value === '/login' || value.startsWith('/login?')) return null;

  const [path, query = ''] = value.split('?', 2);
  if (!allowedPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return null;
  return query ? `${path}?${query}` : path;
}

export function loginHref(returnTo: string): string {
  const safe = safeReturnTo(returnTo);
  return safe ? `/login?returnTo=${encodeURIComponent(safe)}` : '/login';
}
