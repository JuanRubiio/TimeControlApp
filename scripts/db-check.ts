import pg from 'pg';
import { logEvent } from '../src/shared/observability';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL es obligatorio.');

async function main() {
  const client = new pg.Client({ connectionString: databaseUrl });
  await client.connect();
  try {
    await client.query('SELECT 1');
    logEvent('info', 'database.check_succeeded');
  } finally { await client.end(); }
}
main().catch(() => { logEvent('error', 'database.check_failed'); process.exitCode = 1; });
