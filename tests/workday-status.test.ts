import { describe,expect,it } from 'vitest';
import { projectWorkday } from '../src/workday-status/contracts';
const base={employeeId:'e',laborDate:'2026-10-25',siteId:'s',effectiveTimeZone:'Europe/Madrid'};
const event=(eventType:any,occurredAt:string,id=eventType)=>({id,eventType,occurredAt,ruleVersionId:'r',siteId:'s',laborDate:base.laborDate,effectiveTimeZone:base.effectiveTimeZone});
describe('S18 proyección informativa',()=>{
  it('avanza sólo durante trabajo desde el asOf de servidor',()=>expect(projectWorkday({...base,events:[event('clock_in','2026-10-25T00:00:00.000Z')]},'2026-10-25T01:30:00.000Z')).toMatchObject({status:'working',effectiveMinutes:90,nextAction:'break_start'}));
  it('congela la pausa y salida, incluso en DST',()=>{expect(projectWorkday({...base,events:[event('clock_in','2026-10-25T00:00:00.000Z'),event('break_start','2026-10-25T01:00:00.000Z')]},'2026-10-25T04:00:00.000Z')).toMatchObject({status:'on_break',effectiveMinutes:60});expect(projectWorkday({...base,events:[event('clock_in','2026-10-25T00:00:00.000Z'),event('clock_out','2026-10-25T03:00:00.000Z')]},'2026-10-25T05:00:00.000Z')).toMatchObject({status:'ended',effectiveMinutes:180});});
  it('no inventa minutos sin evidencia',()=>expect(projectWorkday({...base,events:[]},'2026-10-25T01:00:00.000Z')).toMatchObject({status:'not_started',effectiveMinutes:null,lastConfirmedAt:null}));
  it('no inventa minutos ante una secuencia incompleta sin entrada',()=>expect(projectWorkday({...base,events:[event('clock_out','2026-10-25T01:00:00.000Z')]},'2026-10-25T02:00:00.000Z')).toMatchObject({effectiveMinutes:null}));
});
