import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('shell autenticado', () => {
  it('centraliza las rutas visibles y anuncia el destino activo', () => {
    const nav = readFileSync('src/ui/workspace-nav.tsx', 'utf8');
    expect(nav).toContain('usePathname');
    expect(nav).toContain("aria-current={active ? 'page' : undefined}");
    expect(nav).toContain('WorkspaceNavItem');
    expect(nav).toContain('secondaryItems');
    expect(nav).toContain('workspace-nav__secondary');
    expect(readFileSync('src/app/globals.css', 'utf8')).toContain('.workspace-nav__primary+.link-button{margin-top:auto}');
  });

  it('mantiene los menús declarativos, sin permisos de cliente', () => {
    expect(readFileSync('src/employee/components.tsx', 'utf8')).toContain('WorkspaceNav');
    expect(readFileSync('src/manager/components.tsx', 'utf8')).toContain('WorkspaceNav');
    expect(readFileSync('src/admin/components.tsx', 'utf8')).toContain('WorkspaceNav');
    expect(readFileSync('src/admin/components.tsx', 'utf8')).toContain('secondaryItems={[{ href: \'/admin/configuration\'');
    expect(readFileSync('src/auth/page-guard.ts', 'utf8')).toContain('requireWorkspaceRole');
  });
});
