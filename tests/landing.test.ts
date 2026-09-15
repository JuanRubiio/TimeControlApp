import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const page = readFileSync('src/app/page.tsx', 'utf8');
const styles = readFileSync('src/app/globals.css', 'utf8');

describe('landing pública', () => {
  it('ofrece información y un acceso, sin captación pública', () => {
    expect(page).toContain('href="/login"');
    expect(page).toContain('No realiza seguimiento continuo de ubicación.');
    expect(page).not.toMatch(/<form|newsletter|analytics/i);
  });

  it('mantiene una composición adaptable para pantallas estrechas', () => {
    expect(styles).toContain('.landing-shell');
    expect(styles).toContain('@media(max-width:700px){.landing-hero');
    expect(styles).toContain('@media(max-width:540px){.landing-shell');
  });
});
