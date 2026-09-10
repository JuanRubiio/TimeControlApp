import { createHash, randomUUID } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import pg from 'pg';

const databaseUrl = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;
const environmentId = process.env.ENVIRONMENT_ID;
if (!databaseUrl || !environmentId) throw new Error('DATABASE_URL y ENVIRONMENT_ID son obligatorios.');
async function main() {
const client = new pg.Client({ connectionString: databaseUrl });
await client.connect();
try {
  await client.query('CREATE TABLE IF NOT EXISTS schema_migrations (name text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT clock_timestamp(), checksum text NOT NULL)');
  const files = (await readdir('migrations')).filter((name) => name.endsWith('.sql')).sort();
  for (const name of files) {
    const sql = await readFile(path.join('migrations', name), 'utf8');
    const checksum = createHash('sha256').update(sql).digest('hex');
    const existing = await client.query<{ checksum: string }>('SELECT checksum FROM schema_migrations WHERE name = $1', [name]);
    if (existing.rowCount) {
      if (existing.rows[0].checksum !== checksum) throw new Error(`Migración aplicada modificada: ${name}`);
      continue;
    }
    await client.query('BEGIN');
    try { await client.query(sql); await client.query('INSERT INTO schema_migrations(name, checksum) VALUES ($1, $2)', [name, checksum]); await client.query('COMMIT'); }
    catch (error) { await client.query('ROLLBACK'); throw error; }
  }
  const row = await client.query<{ environment_id: string }>('SELECT environment_id FROM environment_context WHERE singleton = true');
  if (!row.rowCount) await client.query('INSERT INTO environment_context(singleton, environment_id) VALUES (true, $1)', [environmentId]);
  else if (row.rows[0].environment_id !== environmentId) throw new Error('ENVIRONMENT_ID no coincide con el entorno dedicado de la base.');
  console.log(JSON.stringify({ migrated: true, correlationId: randomUUID() }));
} finally { await client.end(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
