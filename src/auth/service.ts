import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { db } from '@/shared/db';
import { config } from '@/shared/config';
import { appendAudit } from '@/audit/audit-writer';
import { verifyPassword } from './password';
import { verifyTotp } from './totp';
import type { Actor } from '@/permissions/authorizer';

const tokenHash = (token: string) => createHash('sha256').update(token).digest('hex');
export const newSessionToken = () => randomBytes(32).toString('base64url');
type User = { id:string; email:string; display_name:string; password_hash:string; is_active:boolean; mfa_secret:string|null; mfa_enrolled_at:Date|null; roles:string[]; permissions:string[] };
async function userByEmail(email: string): Promise<User | null> {
  const result = await db.query<User>(`SELECT u.*, coalesce(array_agg(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL), '{}') roles, coalesce(array_agg(DISTINCT rp.permission_code) FILTER (WHERE rp.permission_code IS NOT NULL), '{}') permissions FROM users u LEFT JOIN user_role_assignments ura ON ura.user_id=u.id AND ura.valid_from<=clock_timestamp() AND (ura.valid_to IS NULL OR ura.valid_to>clock_timestamp()) LEFT JOIN roles r ON r.id=ura.role_id LEFT JOIN role_permissions rp ON rp.role_id=r.id WHERE u.email=$1 GROUP BY u.id`, [email.toLowerCase()]); return result.rows[0] ?? null;
}
export async function passwordLogin(email:string, password:string, correlationId:string) {
  const user = await userByEmail(email); const valid = !!user?.is_active && await verifyPassword(user?.password_hash ?? '$argon2id$v=19$m=19456,t=2,p=1$AAAAAAAAAAAAAAAAAAAAAA$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', password);
  if (!valid || !user) { await appendAudit({actorType:'system', action:'auth.login',resourceType:'session',result:'denied',correlationId, changes:{reason:'invalid_credentials'}}); return null; }
  if (user.roles.includes('admin') && !user.mfa_enrolled_at) return { status: 'mfa_enrollment_required' as const, challenge: await createChallenge(user.id, 'mfa_enroll') };
  if (user.roles.includes('admin')) return { status: 'mfa_required' as const, challenge: await createChallenge(user.id, 'mfa_verify') };
  return { status:'authenticated' as const, session: await createSession(user.id, correlationId) };
}
export async function finishMfa(userId:string, code:string, correlationId:string) {
  const result = await db.query<{mfa_secret:string|null}>('SELECT mfa_secret FROM users WHERE id=$1 AND is_active=true', [userId]); const secret=result.rows[0]?.mfa_secret;
  if (!secret || !verifyTotp(secret, code)) { await appendAudit({actorType:'user',actorId:userId,action:'auth.mfa.verify',resourceType:'user',resourceId:userId,result:'denied',correlationId}); return null; }
  return createSession(userId, correlationId);
}
export async function createSession(userId:string, correlationId:string) { const token=newSessionToken(); const expiresAt=new Date(Date.now()+config.SESSION_TTL_HOURS*3600000); await db.query('INSERT INTO auth_sessions(user_id,token_hash,expires_at,correlation_id) VALUES($1,$2,$3,$4)',[userId,tokenHash(token),expiresAt,correlationId]); await appendAudit({actorType:'user',actorId:userId,action:'auth.session.created',resourceType:'session',result:'success',correlationId}); return {token, expiresAt}; }
export async function currentActor(token:string): Promise<Actor|null> { const q=await db.query<{id:string;roles:string[];permissions:string[]}>(`SELECT u.id,coalesce(array_agg(DISTINCT r.code) FILTER (WHERE r.code IS NOT NULL),'{}') roles,coalesce(array_agg(DISTINCT rp.permission_code) FILTER (WHERE rp.permission_code IS NOT NULL),'{}') permissions FROM auth_sessions s JOIN users u ON u.id=s.user_id LEFT JOIN user_role_assignments ura ON ura.user_id=u.id AND ura.valid_from<=clock_timestamp() AND (ura.valid_to IS NULL OR ura.valid_to>clock_timestamp()) LEFT JOIN roles r ON r.id=ura.role_id LEFT JOIN role_permissions rp ON rp.role_id=r.id WHERE s.token_hash=$1 AND s.revoked_at IS NULL AND s.expires_at>clock_timestamp() AND u.is_active=true GROUP BY u.id`,[tokenHash(token)]); const row=q.rows[0]; return row ? {id:row.id,roles:row.roles,permissions:new Set(row.permissions)}:null; }
export async function revokeSession(token:string, correlationId:string) { const q=await db.query<{user_id:string}>('UPDATE auth_sessions SET revoked_at=clock_timestamp() WHERE token_hash=$1 AND revoked_at IS NULL RETURNING user_id',[tokenHash(token)]); if(q.rowCount) await appendAudit({actorType:'user',actorId:q.rows[0].user_id,action:'auth.session.revoked',resourceType:'session',result:'success',correlationId}); }
async function createChallenge(userId:string, purpose:'mfa_enroll'|'mfa_verify') { const token=randomUUID()+randomBytes(16).toString('hex'); await db.query('INSERT INTO auth_challenges(user_id,token_hash,purpose,expires_at) VALUES($1,$2,$3,clock_timestamp()+interval \'5 minutes\')',[userId,tokenHash(token),purpose]); return token; }
export async function consumeChallenge(token:string, purpose:'mfa_enroll'|'mfa_verify') { const q=await db.query<{user_id:string}>(`UPDATE auth_challenges SET consumed_at=clock_timestamp() WHERE token_hash=$1 AND purpose=$2 AND consumed_at IS NULL AND expires_at>clock_timestamp() RETURNING user_id`,[tokenHash(token),purpose]); return q.rows[0]?.user_id ?? null; }
