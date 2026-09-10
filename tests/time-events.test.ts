import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { assertSequence } from '../src/time-events/contracts';
import { timeEventCommand } from '../src/time-events/validation';
import { localDateAt } from '../src/work-rules/validation';

describe('S4 fichaje y pausas',()=>{
  it('sólo permite la máquina de estados de fichaje',()=>{
    expect(()=>assertSequence(undefined,'clock_in')).not.toThrow();
    expect(()=>assertSequence('clock_in','break_start')).not.toThrow();
    expect(()=>assertSequence('break_start','break_end')).not.toThrow();
    expect(()=>assertSequence('break_end','clock_out')).not.toThrow();
    expect(()=>assertSequence('clock_in','clock_in')).toThrow('TIME_EVENT_SEQUENCE_INVALID');
    expect(()=>assertSequence('break_start','clock_out')).toThrow('TIME_EVENT_SEQUENCE_INVALID');
  });
  it('acepta sólo timestamp de dispositivo UTC explícito',()=>{
    expect(timeEventCommand.safeParse({eventType:'clock_in',deviceOccurredAt:'2026-10-25T01:30:00.000Z'}).success).toBe(true);
    expect(timeEventCommand.safeParse({eventType:'clock_in',deviceOccurredAt:'2026-10-25T02:30:00'}).success).toBe(false);
  });
  it('conserva fecha laboral correcta en medianoche y los dos cambios DST',()=>{
    expect(localDateAt('2026-01-10T23:30:00.000Z','Europe/Madrid')).toBe('2026-01-11');
    expect(localDateAt('2026-03-29T00:30:00.000Z','Europe/Madrid')).toBe('2026-03-29');
    expect(localDateAt('2026-10-25T01:30:00.000Z','Europe/Madrid')).toBe('2026-10-25');
  });
  it('hace que PostgreSQL preserve evidencia y serialice reintentos por empleado',()=>{
    const sql=readFileSync('migrations/s004_202609101500_time_events.sql','utf8');
    expect(sql).toContain("CHECK (event_type IN ('clock_in','clock_out','break_start','break_end'))");
    expect(sql).toContain('PRIMARY KEY (employee_id, idempotency_key)');
    expect(sql).toContain('domain_event_outbox');
    expect(sql).not.toMatch(/GRANT[^\n]*(UPDATE|DELETE) ON time_events/i);
  });
  it('no almacena PIN ni QR en claro',()=>{
    const sql=readFileSync('migrations/s004_202609101500_time_events.sql','utf8');
    expect(sql).toContain('lookup_hmac'); expect(sql).toContain('pin_hash'); expect(sql).toContain('token_hash');
  });
});
