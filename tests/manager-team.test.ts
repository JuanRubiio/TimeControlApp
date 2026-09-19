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
});
