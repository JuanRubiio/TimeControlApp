import { describe,expect,it } from 'vitest';
import { AuthorizationError, type ScopedActor } from '../src/permissions/authorizer';
import { publishedWorkdayFailure, publishedWorkdayResponse } from '../src/published-workday/http';

const actor:ScopedActor={id:'synthetic-employee',permissions:new Set(['time-event.read:self']),roles:['employee']};
describe('S23 respuestas HTTP de jornada publicada',()=>{
  it('devuelve un sobre mínimo sin datos de ámbito o eventos',async()=>{
    const response=publishedWorkdayResponse({laborDate:'2026-10-25',effectiveTimeZone:'Europe/Madrid',schedule:null,evidence:{status:'no_evidence',laborDate:null}},'synthetic-correlation');
    expect(response.status).toBe(200); await expect(response.json()).resolves.toEqual({data:{laborDate:'2026-10-25',effectiveTimeZone:'Europe/Madrid',schedule:null,evidence:{status:'no_evidence',laborDate:null}},correlationId:'synthetic-correlation'});
  });
  it('no filtra motivos internos en fallos de autorización o servidor',async()=>{
    const forbidden=publishedWorkdayFailure(actor,'cid',new AuthorizationError('another tenant scope'));
    const internal=publishedWorkdayFailure(actor,'cid',new Error('database password'));
    expect(forbidden.status).toBe(403); expect(internal.status).toBe(500);
    await expect(forbidden.text()).resolves.not.toContain('tenant'); await expect(internal.text()).resolves.not.toContain('password');
  });
});
