import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('catálogo UI transversal', () => {
  const controls = readFileSync('src/ui/controls.tsx', 'utf8');
  const css = readFileSync('src/app/globals.css', 'utf8');

  it('ofrece acciones, campos y selectores reutilizables con semántica nativa', () => {
    expect(controls).toContain('function UiAction');
    expect(controls).toContain("type={type ?? 'button'}");
    expect(controls).toContain('function UiField');
    expect(controls).toContain('function UiSelect');
  });

  it('define tonos y tamaños compactos consistentes sin eliminar el foco visible', () => {
    expect(css).toContain('--ui-action-height:40px');
    expect(css).toContain('.ui-action--quiet');
    expect(css).toContain('.ui-field__error');
    expect(css).toContain(':focus-visible');
  });
});
