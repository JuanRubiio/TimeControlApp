import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('búsqueda de lugar para zona de fichaje', () => {
  const route = readFileSync('src/app/api/v1/location-search/route.ts', 'utf8');
  const service = readFileSync('src/location-search/service.ts', 'utf8');
  const ui = readFileSync('src/configuration/components.tsx', 'utf8');
  it('requiere permiso administrativo, valida la consulta y no hace autocompletado', () => {
    expect(route).toContain("authenticated(request, 'clocking-policy.write')");
    expect(route).toContain('min(3).max(180)');
    expect(ui).toContain('Buscar en el mapa');
    expect(ui).toContain('no se usa autocompletado');
  });
  it('protege la instancia pública de Nominatim con límite y caché', () => {
    expect(service).toContain('lastRequestAt < 1000');
    expect(service).toContain('cacheMs = 24 * 60 * 60 * 1000');
    expect(service).toContain("url.searchParams.set('limit', '5')");
    expect(service).toContain("'User-Agent': 'TimeControlApp/0.1");
  });
});
