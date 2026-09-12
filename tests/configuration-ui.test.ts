import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('S16 configuración guiada',()=>{
  const ui=readFileSync('src/configuration/components.tsx','utf8');
  const api=readFileSync('src/configuration/api.ts','utf8');
  it('usa los contratos existentes y confirma progreso desde las respuestas de API',()=>{
    expect(ui).toContain('ESTADO DEL ENTORNO');
    expect(ui).toContain('datos confirmados por API');
    expect(ui).toContain('<AdminNav />');
    expect(ui).toContain('configuration-grid');
    expect(api).toContain("'/api/v1/companies'");
    expect(api).toContain("'/api/v1/rule-versions'");
    expect(api).toContain("'/api/v1/employments'");
  });
  it('explica las vigencias, la pausa manual y el bloqueo de exportación',()=>{
    expect(ui).toContain('no permite sobrescribir la historia');
    expect(ui).toContain('pausas son manuales y visibles');
    expect(ui).toContain('Exportaciones');
    expect(ui).toContain('permanecen bloqueadas');
  });
  it('no añade una descarga ni modifica los contratos de servidor',()=>{
    expect(api).not.toContain('/api/v1/exports');
    expect(ui).not.toContain('descargar');
  });
  it('protege la ruta de configuración antes de mostrarla',()=>{
    const page=readFileSync('src/app/admin/configuration/page.tsx','utf8');
    expect(page).toContain("'company.write'");
    expect(page).toContain("redirect('/admin')");
  });
});
