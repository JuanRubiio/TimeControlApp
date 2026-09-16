import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = (file: string) => readFileSync(resolve(process.cwd(), file), 'utf8');

describe('transición global entre rutas', () => {
  it('envuelve cada vista de App Router en una transición de entrada', () => {
    expect(source('src/app/template.tsx')).toContain('className="route-transition"');
  });

  it('respeta la preferencia de reducción de movimiento', () => {
    const css = source('src/app/route-transitions.css');
    expect(css).toContain('@media(prefers-reduced-motion:reduce)');
    expect(css).toContain('.route-transition{animation:none}');
  });
});
