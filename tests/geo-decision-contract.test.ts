import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('ADR-0006 geolocalización puntual',()=>{
  const adr=readFileSync('docs/mvp/adr-0006-geolocalizacion-puntual.md','utf8');
  it('mantiene la captura real bloqueada hasta una decisión posterior',()=>{
    expect(adr).toContain('Se rechaza por defecto la ubicación real');
    expect(adr).toContain('EIPD preventiva');
    expect(adr).toContain('La #43 permanece bloqueada');
    expect(adr).toContain('Política futura de método de fichaje por relación laboral');
    expect(adr).toContain('método equivalente sin localización');
  });
});
