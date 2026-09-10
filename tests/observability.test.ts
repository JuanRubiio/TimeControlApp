import { describe, expect, it } from 'vitest';
import { metricsText, safeLogContext } from '../src/shared/observability';

describe('observability minimizada', () => {
  it('elimina secretos y PII frecuente de logs estructurados', () => {
    expect(safeLogContext({ environment: 'pilot-a', email: 'person@example.test', token: 'x', status: 503 })).toEqual({ environment: 'pilot-a', status: 503 });
  });
  it('expone sólo métricas técnicas agregadas', () => {
    expect(metricsText(true)).toContain('time_control_application_up 1');
    expect(metricsText(true)).not.toContain('environment');
  });
});
