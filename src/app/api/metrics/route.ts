import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/shared/db';
import { logEvent, metricsText } from '@/shared/observability';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const expected = process.env.METRICS_BEARER_TOKEN;
  if (expected && request.headers.get('authorization') !== `Bearer ${expected}`) {
    return new NextResponse('Unauthorized\n', { status: 401 });
  }
  try {
    await db.query('SELECT 1');
    return new NextResponse(metricsText(true), { headers: { 'Content-Type': 'text/plain; version=0.0.4', 'Cache-Control': 'no-store' } });
  } catch {
    logEvent('warn', 'metrics.database_unavailable');
    return new NextResponse(metricsText(false), { status: 503, headers: { 'Content-Type': 'text/plain; version=0.0.4', 'Cache-Control': 'no-store' } });
  }
}
