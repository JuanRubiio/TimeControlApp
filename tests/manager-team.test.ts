import { afterEach, describe, expect, it, vi } from 'vitest';
import { managerApi } from '@/manager/api';

describe('HU-TC-051 · cliente de equipo del responsable',()=>{
  afterEach(()=>vi.unstubAllGlobals());
  it('consulta sólo el resumen minimizado del equipo en el endpoint del responsable',async()=>{
    const fetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{team:[]}})});
    vi.stubGlobal('fetch',fetch);
    await expect(managerApi.team()).resolves.toEqual([]);
    expect(fetch).toHaveBeenCalledWith('/api/v1/manager/team',{credentials:'same-origin'});
  });
  it('codifica el identificador al pedir el detalle de una persona',async()=>{
    const fetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{person:{}}})});
    vi.stubGlobal('fetch',fetch);
    await managerApi.person('persona / prueba');
    expect(fetch).toHaveBeenCalledWith('/api/v1/manager/team/persona%20%2F%20prueba',{credentials:'same-origin'});
  });
});
