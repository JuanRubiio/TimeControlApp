import { NextResponse } from 'next/server';
import { db } from '@/shared/db';
import { logEvent } from '@/shared/observability';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await db.query('SELECT 1');
    return NextResponse.json({ status: 'ok', database: 'ok' }, { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    logEvent('warn', 'healthcheck.database_unavailable');
    return NextResponse.json({ status: 'unavailable', database: 'unavailable' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
