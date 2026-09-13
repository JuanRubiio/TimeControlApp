import { createHash, randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { db } from '@/shared/db';
import { config } from '@/shared/config';
import { expireDueExports, exportArtifactPath } from '@/exports/retention';

if (process.env.S15_RETENTION_VERIFY !== 'true') throw new Error('Defina S15_RETENTION_VERIFY=true para ejecutar la evidencia sintética.');

async function main() {
  const user = await db.query<{ id: string }>('SELECT id FROM users ORDER BY created_at,id LIMIT 1');
  const site = await db.query<{ id: string }>('SELECT s.id FROM sites s JOIN companies c ON c.id=s.company_id WHERE c.environment_id=$1 ORDER BY s.id LIMIT 1', [config.ENVIRONMENT_ID]);
  if (!user.rowCount || !site.rowCount) throw new Error('Cargue primero un perfil demo sintético S11/S13.');
  const id = randomUUID(), storageKey = `${id}.csv`, bytes = Buffer.from('evidencia-de-retencion-s15-sintetica', 'utf8');
  const storageRoot = config.EXPORT_STORAGE_DIR ?? path.join(process.cwd(), '.exports');
  await mkdir(storageRoot, { recursive: true });
  await writeFile(exportArtifactPath(storageRoot, storageKey), bytes, { flag: 'wx' });
  await db.query("INSERT INTO exports(id,requested_by_user_id,format,scope_type,site_id,period_from,period_to,snapshot,manifest,content_hash,storage_key,template_version,generated_at,expires_at) VALUES($1,$2,'csv','site',$3,current_date,current_date,$4,$5,$6,$7,'s15.synthetic',clock_timestamp(),clock_timestamp()-interval '1 minute')", [id, user.rows[0].id, site.rows[0].id, JSON.stringify({ synthetic: true, purpose: 's15-retention-verification' }), JSON.stringify({ synthetic: true, purpose: 's15-retention-verification' }), createHash('sha256').update(bytes).digest('hex'), storageKey]);
  const result = await expireDueExports();
  const record = await db.query<{ status: string; expiredAt: Date | null; manifest: unknown; snapshot: unknown }>('SELECT status,expired_at AS "expiredAt",manifest,snapshot FROM exports WHERE id=$1', [id]);
  const audit = await db.query('SELECT id FROM audit_entries WHERE environment_id=$1 AND action=$2 AND resource_id=$3 AND result=$4', [config.ENVIRONMENT_ID, 'export.expired', id, 'success']);
  await readFile(exportArtifactPath(storageRoot, storageKey)).then(() => { throw new Error('El artefacto vencido permanece en almacenamiento.'); }, (error: NodeJS.ErrnoException) => { if (error.code !== 'ENOENT') throw error; });
  if (record.rows[0]?.status !== 'expired' || !record.rows[0].expiredAt || !record.rows[0].manifest || !record.rows[0].snapshot || !audit.rowCount) throw new Error('No se conservó el estado, manifiesto, snapshot y auditoría esperados.');
  console.log(JSON.stringify({ verified: true, expired: result.expired, auditEntries: audit.rowCount, synthetic: true }));
}

main().finally(() => db.end()).catch((error) => { console.error('S15 export retention verification failed:', error instanceof Error ? error.message : 'unknown error'); process.exitCode = 1; });
