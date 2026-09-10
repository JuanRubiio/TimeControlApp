import { describe, expect, it, vi, afterEach } from 'vitest';
import { adminApi } from '../src/admin/api';
import { correctionLabel, eventLabel, minutes } from '../src/admin/presentation';

describe('S8 filtros y presentación',()=>{
  it('presenta filtros de estado conocidos y evidencia en español',()=>{
    expect(eventLabel.break_start).toBe('Inicio de pausa');
    expect(correctionLabel.rejected).toBe('Rechazada');
    expect(minutes(75)).toBe('1 h 15 min');
  });
});
describe('S8 contratos de cliente',()=>{afterEach(()=>vi.unstubAllGlobals());it('envía filtros de ámbito al adaptador administrativo',async()=>{
  const fetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{workdays:[]}})});vi.stubGlobal('fetch',fetch);
  await adminApi.workdays({from:'2026-09-01',to:'2026-09-02',siteId:'10000000-0000-4000-8000-000000000001',incident:'with_incidents'});
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('siteId=10000000-0000-4000-8000-000000000001'),expect.objectContaining({credentials:'same-origin'}));
});it('decide mediante el contrato S6 con idempotencia',async()=>{
  const fetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({data:{correction:{id:'x'}}})});vi.stubGlobal('fetch',fetch);
  await adminApi.decide('10000000-0000-4000-8000-000000000001',{decision:'rejected',reason:'No hay evidencia suficiente'});
  expect(fetch).toHaveBeenCalledWith('/api/v1/corrections/10000000-0000-4000-8000-000000000001/decision',expect.objectContaining({method:'POST',headers:expect.objectContaining({'idempotency-key':expect.any(String)})}));
});});
