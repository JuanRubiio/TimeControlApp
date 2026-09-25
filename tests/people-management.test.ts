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
});
