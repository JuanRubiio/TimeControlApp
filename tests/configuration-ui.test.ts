import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('S16 configuración guiada',()=>{
  const ui=readFileSync('src/configuration/components.tsx','utf8');
  const api=readFileSync('src/configuration/api.ts','utf8');
  it('usa los contratos existentes y confirma progreso desde las respuestas de API',()=>{
    expect(ui).toContain('AVANCE DE CONFIGURACIÓN');
    expect(ui).toContain('confirmados por API');
    expect(ui).toContain('<AdminNav />');
    expect(ui).toContain('configuration-grid');
    expect(api).toContain("'/api/v1/companies'");
    expect(api).toContain("'/api/v1/rule-versions'");
    expect(api).toContain("'/api/v1/employments'");
  });
  it('explica las vigencias, la pausa manual y el bloqueo de exportación',()=>{
    expect(ui).toContain('no sobrescribe la historia');
    expect(ui).toContain('pausas son manuales y visibles');
    expect(ui).toContain('EXPORTACIONES');
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
  it('aplica el catálogo visual y evita que los datos técnicos sean la interfaz principal',()=>{
    expect(ui).toContain('Zona de validación');
    expect(ui).toContain('RealZoneMap');
    expect(ui).toContain('Ajustar coordenadas con precisión');
    expect(ui).toContain('item.label ?? item.name');
    expect(ui).toContain('no existe seguimiento continuo');
    const map=readFileSync('src/configuration/real-zone-map.tsx','utf8');
    expect(map).toContain("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    expect(map).toContain("marker.on('dragend'");
    expect(map).toContain("map.on('click'");
  });
  it('mantiene controles y guardado aislados por bloque',()=>{
    expect(ui).toContain('const [busyForm, setBusyForm]');
    expect(ui).toContain("busyForm === 'zone'");
    expect(ui).toContain("busyForm === 'policy'");
    expect(ui).toContain('Guardar cambios');
  });
});
