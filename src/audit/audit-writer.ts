import { db } from '@/shared/db';
import { config } from '@/shared/config';
export type AuditInput = { actorType: 'user'|'system'|'kiosk'; actorId?: string; action: string; resourceType: string; resourceId?: string; result: 'success'|'denied'|'failure'; correlationId: string; origin?: Record<string, string>; changes?: Record<string, unknown> };
export async function appendAudit(input: AuditInput) {
  await db.query('SELECT audit_append($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [config.ENVIRONMENT_ID, input.actorType, input.actorId ?? null, input.action, input.resourceType, input.resourceId ?? null, input.result, input.correlationId, JSON.stringify(input.origin ?? {}), JSON.stringify(input.changes ?? {})]);
}
