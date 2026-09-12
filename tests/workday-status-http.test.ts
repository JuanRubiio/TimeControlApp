import { describe, expect, it } from 'vitest';
import { AuthorizationError, type ScopedActor } from '../src/permissions/authorizer';
import { workdayStatusFailure, workdayStatusResponse } from '../src/workday-status/http';

const actor: ScopedActor={id:'synthetic-employee',permissions:new Set(['time-event.read:self']),roles:['employee']};

describe('S18 respuestas HTTP de estado de jornada',()=>{
  it('devuelve un sobre mínimo para la propia sesión',async()=>{
    const response=workdayStatusResponse({status:'working',effectiveMinutes:35},'synthetic-correlation');
    expect(response.status).toBe(200);
    expect(response.headers.get('x-correlation-id')).toBe('synthetic-correlation');
    await expect(response.json()).resolves.toEqual({data:{status:'working',effectiveMinutes:35},correlationId:'synthetic-correlation'});
  });

  it('no filtra el motivo interno en los fallos de autenticación, alcance o servidor',async()=>{
    const unauthenticated=workdayStatusFailure(null,'cid',new Error('internal password value'));
    const forbidden=workdayStatusFailure(actor,'cid',new AuthorizationError('scope of another tenant'));
    const internal=workdayStatusFailure(actor,'cid',new Error('internal database details'));
    expect(unauthenticated.status).toBe(401);
    expect(forbidden.status).toBe(403);
    expect(internal.status).toBe(500);
    await expect(unauthenticated.text()).resolves.not.toContain('password');
    await expect(forbidden.text()).resolves.not.toContain('tenant');
    await expect(internal.text()).resolves.not.toContain('database');
  });
});
