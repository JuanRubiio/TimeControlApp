import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticated, data } from '@/company-people/http';
import { searchLocation } from '@/location-search/service';

const queryInput = z.string().trim().min(3).max(180);

export async function GET(request: NextRequest) {
  const access = await authenticated(request, 'clocking-policy.write'); if ('response' in access) return access.response;
  const parsed = queryInput.safeParse(request.nextUrl.searchParams.get('q') ?? '');
  if (!parsed.success) return NextResponse.json({ error: { code: 'VALIDATION_FAILED', message: 'Escriba al menos tres caracteres para buscar una dirección o lugar.' }, correlationId: access.cid }, { status: 422 });
  try { return data(await searchLocation(parsed.data), access.cid); } catch (error) {
    const message = error instanceof Error && error.message === 'LOCATION_SEARCH_RATE_LIMITED' ? 'Espere un segundo antes de hacer otra búsqueda.' : 'El servicio de búsqueda no está disponible. Puede situar el punto directamente en el mapa.';
    return NextResponse.json({ error: { code: 'LOCATION_SEARCH_UNAVAILABLE', message }, correlationId: access.cid }, { status: 503 });
  }
}
