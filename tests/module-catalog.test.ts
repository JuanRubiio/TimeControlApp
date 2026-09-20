import { readFileSync } from 'node:fs';
import { describe,it,expect } from 'vitest';
import { PRODUCT_MODULES,installed } from '@/modules/catalog';
describe('module catalogue',()=>{it('uses stable identifiers and does not treat a disabled module as installed',()=>{expect(PRODUCT_MODULES.map(module=>module.key)).toEqual(['shift_planning','exports']);expect(installed('disabled')).toBe(false);expect(installed('active')).toBe(true);});it('keeps exports visibly locked even when it can be installed',()=>{expect(PRODUCT_MODULES.find(module=>module.key==='exports')?.locked).toBe(true);});});

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
});
