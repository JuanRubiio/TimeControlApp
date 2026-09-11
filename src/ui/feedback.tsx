import type { ReactNode } from 'react';

export type FeedbackKind = 'info' | 'success' | 'error' | 'warning';

export function StatusNotice({ children, kind = 'info' }: { children: ReactNode; kind?: FeedbackKind }) {
  return <p className={`status-notice status-notice--${kind}`} role={kind === 'error' ? 'alert' : 'status'}>{children}</p>;
}

export function StatusBadge({ children, kind = 'info' }: { children: ReactNode; kind?: FeedbackKind }) {
  return <span className={`status-badge status-badge--${kind}`}>{children}</span>;
}

export function LoadingBlock({ children = 'Cargando información…' }: { children?: ReactNode }) {
  return <p className="loading-block" role="status" aria-live="polite"><span aria-hidden="true" className="loading-block__dot" />{children}</p>;
}
