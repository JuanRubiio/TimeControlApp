import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync('src/app/transparencia/page.tsx', 'utf8');
const styles = readFileSync('src/app/globals.css', 'utf8');

describe('página pública de transparencia', () => {
  it('explica el producto sin requerir sesión ni captar datos', () => {
    expect(page).toContain('id: \'registro\'');
    expect(page).toContain('id: \'ubicacion\'');
    expect(page).toContain('id: \'limites\'');
    expect(page).toContain('no realiza seguimiento continuo');
    expect(page).not.toMatch(/<form|fetch\(|cookies\(|requirePageSession|analytics/i);
  });

  it('incluye anclas navegables y diseño adaptable', () => {
    expect(page).toContain('aria-label="En esta página"');
    expect(page).toContain('href={`#${section.id}`}');
    expect(styles).toContain('.transparency-shell');
    expect(styles).toContain('@media(max-width:700px){.transparency-hero');
    expect(styles).toContain('@media(max-width:540px){.transparency-shell');
  });
});
