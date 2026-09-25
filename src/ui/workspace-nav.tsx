'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/auth/ui';

export type WorkspaceNavItem = { href: string; label: string };

const isActive = (pathname: string, href: string) => href === pathname || (href !== '/employee' && href !== '/manager' && href !== '/admin' && pathname.startsWith(`${href}/`));

export function WorkspaceNav({ ariaLabel, items, secondaryItems=[], variant }: { ariaLabel: string; items: WorkspaceNavItem[]; secondaryItems?:WorkspaceNavItem[]; variant: 'employee' | 'manager' | 'admin' }) {
  const pathname = usePathname();
  const renderItem=(item:WorkspaceNavItem)=>{
    const active = isActive(pathname, item.href);
    return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined} className={active ? 'workspace-nav__link workspace-nav__link--active' : 'workspace-nav__link'}>{item.label}</Link>;
  };
  return <nav className={`workspace-nav workspace-nav--${variant}`} aria-label={ariaLabel}><div className="workspace-nav__primary">{items.map(renderItem)}</div>{secondaryItems.length>0&&<div className="workspace-nav__secondary">{secondaryItems.map(renderItem)}</div>}<LogoutButton /></nav>;
}
