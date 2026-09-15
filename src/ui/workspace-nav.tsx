'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/auth/ui';

export type WorkspaceNavItem = { href: string; label: string };

const isActive = (pathname: string, href: string) => href === pathname || (href !== '/employee' && href !== '/manager' && href !== '/admin' && pathname.startsWith(`${href}/`));

export function WorkspaceNav({ ariaLabel, items, variant }: { ariaLabel: string; items: WorkspaceNavItem[]; variant: 'employee' | 'manager' | 'admin' }) {
  const pathname = usePathname();
  return <nav className={`workspace-nav workspace-nav--${variant}`} aria-label={ariaLabel}>{items.map((item) => {
    const active = isActive(pathname, item.href);
    return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={active ? 'workspace-nav__link workspace-nav__link--active' : 'workspace-nav__link'}>{item.label}</Link>;
  })}<LogoutButton /></nav>;
}
