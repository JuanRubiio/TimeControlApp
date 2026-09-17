import { describe, expect, it } from 'vitest';
import { expectedMinutes } from '@/shift-planning/validation';

describe('duración prevista de plantilla', () => {
  it('la deriva de los tramos y no de un campo editable', () => {
    expect(expectedMinutes([{ start: '09:00', end: '13:00' }, { start: '14:00', end: '18:00' }])).toBe(480);
  });

  it('calcula correctamente un tramo que cruza medianoche', () => {
    expect(expectedMinutes([{ start: '22:00', end: '06:00' }])).toBe(480);
  });
});
