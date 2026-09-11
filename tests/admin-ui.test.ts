import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('S13 detalle de corrección', () => {
  it('actualiza la decisión local tras la respuesta de la API', () => {
    const source = readFileSync('src/admin/components.tsx', 'utf8');
    expect(source).toContain('const [decided,setDecided]=useState<CorrectionRequest>()');
    expect(source).toContain('const correction=await adminApi.decide');
    expect(source).toContain('setDecided(correction)');
  });
});
