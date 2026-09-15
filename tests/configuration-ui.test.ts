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
    expect(ui).not.toContain('Ajustar coordenadas con precisión');
    expect(ui).toContain('item.label ?? item.name');
    expect(ui).toContain('no existe seguimiento continuo');
    const map=readFileSync('src/configuration/real-zone-map.tsx','utf8');
    expect(map).toContain("https://tile.openstreetmap.org/{z}/{x}/{y}.png");
    expect(map).toContain("map.on('click'");
    expect(map).toContain('fitBounds(circleRef.current.getBounds()');
    expect(map).toContain('L.divIcon');
    expect(map).toContain("marker.on('dragend'");
    expect(ui).not.toContain('Ajustar coordenadas con precisión');
  });
  it('mantiene controles y guardado aislados por bloque',()=>{
    expect(ui).toContain('const [busyForm, setBusyForm]');
    expect(ui).toContain("busyForm === 'zone'");
    expect(ui).toContain("busyForm === 'policy'");
    expect(ui).toContain('Guardar cambios');
  });
  it('oculta el avance cuando no quedan pasos pendientes',()=>{
    expect(ui).toContain('ready < checklist.length && <section className="configuration-overview"');
    expect(ui).not.toContain('La configuración necesaria para el piloto está completa.');
  });
  it('permite retirar una zona inactiva sin borrar su trazabilidad',()=>{
    expect(ui).toContain('Retirar zona');
    expect(ui).toContain('Se conserva la trazabilidad histórica');
    expect(api).toContain('deleteZone');
    const route=readFileSync('src/app/api/v1/work-location-zones/[id]/route.ts','utf8');
    const service=readFileSync('src/clocking-policy/service.ts','utf8');
    expect(route).toContain("'ZONE_IN_USE'");
    expect(service).toContain("action:'clocking-policy.zone.deactivated'");
  });
  it('muestra y sustituye políticas por trabajador sin reescribir la vigencia anterior',()=>{
    expect(ui).toContain('Política de fichaje por trabajador');
    expect(ui).toContain('Modificar política');
    expect(api).toContain('replaceClockingPolicy');
    const route=readFileSync('src/app/api/v1/clocking-policies/[id]/route.ts','utf8');
    const service=readFileSync('src/clocking-policy/service.ts','utf8');
    expect(route).toContain('replacePolicy');
    expect(service).toContain("action:'clocking-policy.replaced'");
    expect(service).toContain("SET effective_to=$2");
  });
});
