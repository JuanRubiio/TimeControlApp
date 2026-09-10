import { describe, expect, it } from 'vitest'; import { readFileSync } from 'node:fs';
const sql=readFileSync('migrations/s008_202609102100_admin_scope_reads.sql','utf8'); const route=readFileSync('src/app/api/v1/time-events/route.ts','utf8');
describe('S8 alcance administrativo',()=>{
  it('otorga al responsable sólo las lecturas de ámbito necesarias',()=>{expect(sql).toContain("'time-event.read:scope'");expect(sql).toContain("'time-calculation.read:scope'");expect(sql).not.toMatch(/INSERT\s+INTO\s+time_events|UPDATE\s+time_events|DELETE/i);});
  it('autoriza la lectura de eventos de otra persona en servidor antes de listarla',()=>{expect(route).toContain("assertAuthorized(actor,'time-event.read:scope')");expect(route).toContain('canReadEmployee(actor,employee,cid)');expect(route).toContain('getEmployee(requestedEmployeeId)');});
});
