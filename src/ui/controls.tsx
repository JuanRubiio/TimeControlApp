import type { ButtonHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';

type ActionTone = 'primary' | 'secondary' | 'danger' | 'quiet';

export function UiAction({ className = '', tone = 'primary', type, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: ActionTone }) {
  const toneClass = tone === 'primary' ? '' : ` ui-action--${tone}`;
  return <button type={type ?? 'button'} className={`ui-action${toneClass} ${className}`.trim()} {...props} />;
}

export function UiField({ label, help, error, children }: { label: ReactNode; help?: ReactNode; error?: ReactNode; children: ReactNode }) {
  return <label className="ui-field"><span>{label}</span>{children}{help && <small className="ui-field__help">{help}</small>}{error && <small className="ui-field__error" role="alert">{error}</small>}</label>;
}

export function UiSelect({ className = '', ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`ui-control ${className}`.trim()} {...props} />;
}
