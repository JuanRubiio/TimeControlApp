import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('S14 presentación accesible', () => {
  it('publica avisos, badges y carga reutilizables con semántica de estado', () => {
    const source = readFileSync('src/ui/feedback.tsx', 'utf8');
    expect(source).toContain("role={kind === 'error' ? 'alert' : 'status'}");
    expect(source).toContain('status-badge');
    expect(source).toContain('aria-live="polite"');
  });

  it('mantiene los identificadores técnicos fuera del flujo principal', () => {
    const employee = readFileSync('src/employee/components.tsx', 'utf8');
    const admin = readFileSync('src/admin/components.tsx', 'utf8');
    expect(employee).toContain('Información técnica de esta jornada');
    expect(employee).toContain('Si eres responsable o administración, abre Administración');
    expect(admin).toContain('Referencias técnicas de auditoría');
    expect(admin).toContain('disabled={busy}');
  });

  it('define foco visible y puntos de ruptura para pantallas pequeñas', () => {
    const css = readFileSync('src/app/globals.css', 'utf8');
    expect(css).toContain(':focus-visible');
    expect(css).toContain('@media(max-width:540px)');
    expect(css).not.toContain('min-width:320px');
  });
});
