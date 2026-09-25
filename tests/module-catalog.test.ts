import { readFileSync } from 'node:fs';
import { describe,it,expect } from 'vitest';
import { PRODUCT_MODULES,installed } from '@/modules/catalog';
describe('module catalogue',()=>{it('uses stable identifiers and does not treat a disabled module as installed',()=>{expect(PRODUCT_MODULES.map(module=>module.key)).toEqual(['shift_planning','people_management','informative_hour_balance','exports']);expect(installed('disabled')).toBe(false);expect(installed('active')).toBe(true);});it('keeps exports visibly locked even when it can be installed',()=>{expect(PRODUCT_MODULES.find(module=>module.key==='exports')?.locked).toBe(true);});});

describe('module catalogue boundaries',()=>{
  const planningHttp=readFileSync('src/shift-planning/http.ts','utf8');
  const planningPage=readFileSync('src/app/admin/planning/page.tsx','utf8');
  const exportsRoute=readFileSync('src/app/api/v1/exports/route.ts','utf8');
  const migration=readFileSync('migrations/s039_202609201700_module_catalog.sql','utf8');
  it('denies planning access when the module is not active while preserving the module control endpoint',()=>{
    expect(planningHttp).toContain("moduleStatus()!=='active'");
    expect(planningHttp).toContain("planningActor(request,'shift-planning.read',true)");
    expect(planningPage).toContain("redirect('/admin/configuration?module=shift_planning')");
  });
  it('keeps export operations locked server-side and supports both catalogue keys in schema',()=>{
    expect(exportsRoute).toContain("'EXPORTS_LOCKED'");
    expect(exportsRoute).toContain("reason:'S15_NOT_CLOSED'");
    expect(migration).toContain("'shift_planning','exports'");
  });
  it('does not expose planning navigation until the module is confirmed active',()=>{
    const admin=readFileSync('src/admin/components.tsx','utf8');
    const manager=readFileSync('src/manager/components.tsx','utf8');
    const availability=readFileSync('src/modules/ui.ts','utf8');
    const configuration=readFileSync('src/configuration/components.tsx','utf8');
    expect(admin).toContain("useModuleEnabled('shift_planning')");
    expect(admin).toContain("href: '/admin/planning'");
    expect(manager).toContain("planningEnabled?[{href:'/manager/planning'");
    expect(manager).toContain("planningEnabled?managerRead<{holidays:ManagerHoliday[]}>");
    expect(availability).toContain("const [active,setActive]=useState<string[]>(()=>cachedActive??[])");
    expect(availability).toContain('cachedActive=value.data.active');
    expect(configuration).toContain('role="switch"');
    expect(configuration).toContain('moduleAvailabilityChanged()');
  });
  it('keeps person management out of configuration and behind its own enabled module',()=>{
    const peoplePage=readFileSync('src/app/admin/people/page.tsx','utf8');
    const peopleUi=readFileSync('src/admin/people-management.tsx','utf8');
    const admin=readFileSync('src/admin/components.tsx','utf8');
    expect(peoplePage).toContain("productModuleStatus('people_management')");
    expect(peoplePage).toContain("redirect('/admin/configuration?module=people_management')");
    expect(admin).toContain("useModuleEnabled('people_management')");
    expect(peopleUi).toContain('Dar de baja');
    expect(peopleUi).toContain('Editar persona');
    expect(peopleUi).toContain('Crear personas');
  });
});
