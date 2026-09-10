import { describe, expect, it } from 'vitest';
import { correctionInput, decisionInput, idempotencyKey } from '../src/corrections/validation';

const effect={eventType:'clock_out',occurredAt:'2026-06-01T16:00:00.000Z'};
describe('S6 correcciones y aprobaciones',()=>{
  it('exige referencia única, propuesta estructurada y motivo',()=>{
    expect(correctionInput.safeParse({kind:'time_event',timeEventId:'10000000-0000-4000-8000-000000000001',proposedEffect:effect,reason:'Olvidé fichar la salida'}).success).toBe(true);
    expect(correctionInput.safeParse({kind:'time_event',proposedEffect:effect,reason:'x'}).success).toBe(false);
    expect(correctionInput.safeParse({kind:'calculation_incident',dailyCalculationVersionId:'10000000-0000-4000-8000-000000000001',timeEventId:'20000000-0000-4000-8000-000000000001',proposedEffect:effect,reason:'Falta salida'}).success).toBe(false);
  });
  it('modela transiciones explícitas: sólo rechazo exige motivo',()=>{
    expect(decisionInput.safeParse({decision:'approved'}).success).toBe(true);
    expect(decisionInput.safeParse({decision:'rejected'}).success).toBe(false);
    expect(decisionInput.safeParse({decision:'rejected',reason:'La evidencia aportada no permite confirmar el cambio'}).success).toBe(true);
    expect(decisionInput.safeParse({decision:'approved',reason:'sobrante'}).success).toBe(false);
  });
  it('requiere una clave de idempotencia segura para decidir',()=>{expect(()=>idempotencyKey('corta')).toThrow('IDEMPOTENCY_KEY_REQUIRED');expect(idempotencyKey('0123456789abcdef')).toHaveLength(16);});
});
