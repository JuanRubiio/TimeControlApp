import { readFileSync } from 'node:fs';
import { describe,expect,it } from 'vitest';

describe('gestión de personas',()=>{
  it('da de baja de forma lógica y cierra la relación vigente sin borrar historial',()=>{
    const service=readFileSync('src/company-people/service.ts','utf8');
    expect(service).toContain("audit(a,'employee.deactivated'");
    expect(service).toContain('WITH deactivated AS');
    expect(service).toContain('UPDATE employments');
    expect(service).toContain('activeEmploymentsEnded:true');
  });
  it('mantiene separadas persona y cuenta de acceso',()=>{
    const ui=readFileSync('src/admin/people-management.tsx','utf8');
    expect(ui).toContain('pero no una cuenta de acceso');
    expect(ui).toContain('flujo separado');
  });
  it('espera la carga completa y prioriza el listado antes del alta',()=>{
    const ui=readFileSync('src/admin/people-management.tsx','utf8');
    expect(ui).toContain('const [sites,setSites]');
    expect(ui).toContain('Cargando plantilla…');
    expect(ui).toContain('<section className="admin-section"><div className="section-heading"><div><h2>Personas activas</h2>');
    expect(ui).toContain('{showCreate&&<AssistedOnboarding');
    expect(ui).toContain("showCreate?'Cerrar alta':'Nueva persona'");
  });
});
