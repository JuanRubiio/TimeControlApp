'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { loginHref } from '@/auth/return-to';
import { StatusNotice } from './feedback';
import { readRecovery } from './read-recovery';

export function ReadRecoveryNotice({ status, onRetry }: { status?: number; onRetry?: () => void }) {
  const recovery = readRecovery(status);
  const notice = useRef<HTMLParagraphElement>(null);
  const path = usePathname();
  useEffect(() => { notice.current?.focus(); }, [recovery.kind]);
  return <StatusNotice ref={notice} tabIndex={-1} kind="error">{recovery.message}{recovery.kind === 'session-expired' ? <> <Link href={loginHref(path)}>Volver a acceder</Link>.</> : recovery.canRetry && onRetry ? <> <button type="button" className="link-button" onClick={onRetry}>Reintentar la consulta</button>.</> : null}</StatusNotice>;
}
