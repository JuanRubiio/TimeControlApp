export type LocationSearchResult = { label: string; latitude: number; longitude: number };

type NominatimResult = { display_name?: unknown; lat?: unknown; lon?: unknown };
const cache = new Map<string, { expiresAt: number; results: LocationSearchResult[] }>();
let lastRequestAt = 0;
const cacheMs = 24 * 60 * 60 * 1000;

export async function searchLocation(query: string): Promise<LocationSearchResult[]> {
  const normalized = query.trim().replace(/\s+/g, ' ');
  const cached = cache.get(normalized.toLocaleLowerCase());
  if (cached && cached.expiresAt > Date.now()) return cached.results;
  if (Date.now() - lastRequestAt < 1000) throw new Error('LOCATION_SEARCH_RATE_LIMITED');
  lastRequestAt = Date.now();
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', normalized); url.searchParams.set('format', 'jsonv2'); url.searchParams.set('limit', '5'); url.searchParams.set('accept-language', 'es');
  const response = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'TimeControlApp/0.1 (+https://github.com/JuanRubiio/TimeControlApp)' }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error('LOCATION_SEARCH_UNAVAILABLE');
  const body = await response.json() as unknown;
  const results = Array.isArray(body) ? body.flatMap((item): LocationSearchResult[] => {
    const candidate = item as NominatimResult; const latitude = Number(candidate.lat); const longitude = Number(candidate.lon);
    return typeof candidate.display_name === 'string' && Number.isFinite(latitude) && Number.isFinite(longitude) ? [{ label: candidate.display_name, latitude, longitude }] : [];
  }) : [];
  cache.set(normalized.toLocaleLowerCase(), { expiresAt: Date.now() + cacheMs, results });
  return results;
}
