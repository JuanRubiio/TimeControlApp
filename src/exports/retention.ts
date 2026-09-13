import { randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { config } from '@/shared/config';
import { db } from '@/shared/db';

type ExpirableExport = { id: string; storageKey: string };
type RetentionResult = { expired: number; missing: number; failed: number; skipped: boolean };
const RETENTION_LOCK = 15092026;

/** Prevent a database value from making the operations job delete outside its dedicated store. */
export function exportArtifactPath(storageRoot: string, storageKey: string) {
  if (!/^[0-9a-f-]{36}\.(csv|pdf)$/i.test(storageKey)) throw new Error('EXPORT_STORAGE_KEY_INVALID');
  const root = path.resolve(storageRoot);
  const target = path.resolve(root, storageKey);
  if (path.dirname(target) !== root) throw new Error('EXPORT_STORAGE_PATH_INVALID');
  return target;
}

export async function removeExpiredArtifact(storageRoot: string, storageKey: string): Promise<'deleted' | 'missing'> {
  try {
    await unlink(exportArtifactPath(storageRoot, storageKey));
    return 'deleted';
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return 'missing';
    throw error;
  }
}

export async function expireDueExports(now = new Date()): Promise<RetentionResult> {
  const storageRoot = config.EXPORT_STORAGE_DIR ?? path.join(process.cwd(), '.exports');
  const client = await db.connect();
  const result: RetentionResult = { expired: 0, missing: 0, failed: 0, skipped: false };
  try {
    const lock = await client.query<{ locked: boolean }>('SELECT pg_try_advisory_lock($1) AS locked', [RETENTION_LOCK]);
    if (!lock.rows[0]?.locked) return { ...result, skipped: true };
    const due = await client.query<ExpirableExport>("SELECT id, storage_key AS \"storageKey\" FROM exports WHERE status='available' AND expires_at <= $1 ORDER BY expires_at,id FOR UPDATE", [now]);
    for (const item of due.rows) {
      let removal: 'deleted' | 'missing';
      try {
        removal = await removeExpiredArtifact(storageRoot, item.storageKey);
      } catch {
        result.failed += 1;
        await client.query('SELECT audit_append($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [config.ENVIRONMENT_ID, 'system', null, 'export.expiration_failed', 'export', item.id, 'failure', randomUUID(), JSON.stringify({ channel: 'ops-retention' }), JSON.stringify({ storageDeletion: 'failed' })]);
        continue;
      }
      await client.query('BEGIN');
      try {
        await client.query("UPDATE exports SET status='expired', expired_at=clock_timestamp() WHERE id=$1 AND status='available'", [item.id]);
        await client.query('SELECT audit_append($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [config.ENVIRONMENT_ID, 'system', null, 'export.expired', 'export', item.id, 'success', randomUUID(), JSON.stringify({ channel: 'ops-retention' }), JSON.stringify({ storageDeletion: removal })]);
        await client.query('COMMIT');
        result.expired += 1;
        if (removal === 'missing') result.missing += 1;
      } catch (error) {
        await client.query('ROLLBACK');
        result.failed += 1;
        throw error;
      }
    }
    return result;
  } finally {
    await client.query('SELECT pg_advisory_unlock($1)', [RETENTION_LOCK]).catch(() => undefined);
    client.release();
  }
}
