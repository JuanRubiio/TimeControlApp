import { describe,expect,it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('ADR-0006 geolocalización puntual',()=>{
  const adr=readFileSync('docs/mvp/adr-0006-geolocalizacion-puntual.md','utf8');
  it('autoriza sólo un piloto puntual sujeto a límites verificables',()=>{
    expect(adr).toContain('Se aprueba exclusivamente una verificación de ubicación');
    expect(adr).toContain('EIPD preventiva');
    expect(adr).toContain('La #43 queda desbloqueada');
    expect(adr).toContain('Política futura de método de fichaje por relación laboral');
    expect(adr).toContain('método equivalente sin localización');
    expect(adr).toContain('Quedan prohibidos incluso tras una futura autorización');
  });
});
