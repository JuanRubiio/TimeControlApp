import { createHash, createHmac, randomBytes, randomUUID } from 'node:crypto';
import { hash, verify } from '@node-rs/argon2';
import type pg from 'pg';
import { db } from '@/shared/db';
import { config } from '@/shared/config';
import { appendAudit as appendAuditEntry } from '@/audit/audit-writer';
import { localDateAt } from '@/work-rules/validation';
import { PostgresRuleResolver } from '@/work-rules/resolver';
import { PostgresEmploymentScopeProvider } from '@/company-people/rule-scopes';
import { assertSequence, type TimeEvent, type TimeEventMethod, type TimeEventType } from './contracts';

type EventRow = { id:string; employeeId:string; employmentId:string; siteId:string; ruleVersionId:string; eventType:TimeEventType; method:TimeEventMethod; occurredAt:Date; recordedAt:Date; deviceOccurredAt:Date|null; effectiveTimeZone:string; laborDate:string };
type Principal = { employeeId:string; method:TimeEventMethod; userId?:string; kioskSessionId?:string };
const eventColumns=`id,employee_id AS "employeeId",employment_id AS "employmentId",site_id AS "siteId",rule_version_id AS "ruleVersionId",event_type AS "eventType",method,occurred_at AS "occurredAt",recorded_at AS "recordedAt",device_occurred_at AS "deviceOccurredAt",effective_time_zone AS "effectiveTimeZone",labor_date::text AS "laborDate"`;
const toEvent=(row:EventRow):TimeEvent=>({...row,occurredAt:row.occurredAt.toISOString(),recordedAt:row.recordedAt.toISOString(),deviceOccurredAt:row.deviceOccurredAt?.toISOString()??null});
const sha256=(value:string)=>createHash('sha256').update(value).digest('hex');
function kioskPinPepper(){ if(!config.KIOSK_PIN_PEPPER) throw new Error('KIOSK_PIN_PEPPER_REQUIRED'); return config.KIOSK_PIN_PEPPER; }
const pinLookup=(pin:string)=>createHmac('sha256',kioskPinPepper()).update(pin).digest('hex');
const fingerprint=(eventType:TimeEventType,method:TimeEventMethod,kioskSessionId?:string)=>sha256(JSON.stringify({eventType,method,kioskSessionId:kioskSessionId??null}));

async function appendAudit(client:pg.PoolClient,input:{actorType:'user'|'kiosk';actorId?:string;action:string;resourceType:string;resourceId?:string;result:'success'|'denied'|'failure';correlationId:string;changes?:Record<string,unknown>}) {
  await client.query('SELECT audit_append($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[config.ENVIRONMENT_ID,input.actorType,input.actorId??null,input.action,input.resourceType,input.resourceId??null,input.result,input.correlationId,JSON.stringify({}),JSON.stringify(input.changes??{})]);
}

export async function employeeForUser(userId:string) {
  const result=await db.query<{id:string}>(`SELECT e.id FROM employees e JOIN companies c ON c.id=e.company_id WHERE e.user_id=$1 AND e.is_active AND c.environment_id=$2 AND c.is_active`,[userId,config.ENVIRONMENT_ID]);
  return result.rows[0]?.id??null;
}

export async function recordEvent(principal:Principal,eventType:TimeEventType,deviceOccurredAt:string|undefined,idempotencyKey:string,correlationId:string):Promise<{event:TimeEvent;replayed:boolean}> {
  const client=await db.connect();
  try { await client.query('BEGIN');
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 404))',[principal.employeeId]);
    const requestFingerprint=fingerprint(eventType,principal.method,principal.kioskSessionId);
    const prior=await client.query<{request_fingerprint:string;response:{event:TimeEvent}}>('SELECT request_fingerprint,response FROM time_event_idempotency WHERE employee_id=$1 AND idempotency_key=$2',[principal.employeeId,idempotencyKey]);
    if(prior.rowCount) { if(prior.rows[0].request_fingerprint!==requestFingerprint) throw new Error('IDEMPOTENCY_CONFLICT'); await client.query('COMMIT'); return {event:prior.rows[0].response.event,replayed:true}; }
    const serverNow=(await client.query<{now:Date}>('SELECT clock_timestamp() AS now')).rows[0].now;
    const occurredAt=serverNow.toISOString();
    const employment=await new PostgresEmploymentScopeProvider().contextForEmployee(principal.employeeId,occurredAt);
    if(!employment) throw new Error('EMPLOYMENT_NOT_ACTIVE');
    const rule=await new PostgresRuleResolver().resolve({occurredAt,effectiveTimeZone:employment.effectiveTimeZone,scopes:employment.scopes});
    if(!rule) throw new Error('RULE_VERSION_UNRESOLVABLE');
    // El advisory lock anterior serializa todas las escrituras de este empleado.
    // No se usa FOR UPDATE: conceder UPDATE sólo para leer bloquearía la
    // inmutabilidad SQL de la evidencia al rol ordinario de la aplicación.
    const last=await client.query<{event_type:TimeEventType}>('SELECT event_type FROM time_events WHERE employee_id=$1 ORDER BY recorded_at DESC,id DESC LIMIT 1',[principal.employeeId]);
    assertSequence(last.rows[0]?.event_type,eventType);
    const laborDate=localDateAt(occurredAt,employment.effectiveTimeZone);
    const inserted=await client.query<EventRow>(`INSERT INTO time_events(employee_id,employment_id,site_id,rule_version_id,event_type,method,occurred_at,recorded_at,device_occurred_at,effective_time_zone,labor_date,kiosk_session_id,created_by_user_id)
      VALUES($1,$2,$3,$4,$5,$6,$7,$7,$8,$9,$10,$11,$12) RETURNING ${eventColumns}`,[principal.employeeId,employment.employmentId,employment.siteId,rule.ruleVersionId,eventType,principal.method,occurredAt,deviceOccurredAt??null,employment.effectiveTimeZone,laborDate,principal.kioskSessionId??null,principal.userId??null]);
    const event=toEvent(inserted.rows[0]);
    await client.query('INSERT INTO time_event_idempotency(employee_id,idempotency_key,request_fingerprint,event_id,response) VALUES($1,$2,$3,$4,$5)',[principal.employeeId,idempotencyKey,requestFingerprint,event.id,JSON.stringify({event})]);
    await client.query('INSERT INTO domain_event_outbox(name,payload,correlation_id) VALUES($1,$2,$3)', ['time-event.recorded',JSON.stringify({eventId:event.id,employeeId:event.employeeId,eventType:event.eventType,siteId:event.siteId,ruleVersionId:event.ruleVersionId,method:event.method,occurredAt:event.occurredAt}),correlationId]);
    await appendAudit(client,{actorType:principal.method==='web'?'user':'kiosk',actorId:principal.userId,action:'time-event.recorded',resourceType:'time-event',resourceId:event.id,result:'success',correlationId,changes:{employeeId:event.employeeId,eventType:event.eventType,method:event.method,siteId:event.siteId,laborDate:event.laborDate,effectiveTimeZone:event.effectiveTimeZone,ruleVersionId:event.ruleVersionId}});
    await client.query('COMMIT'); return {event,replayed:false};
  } catch(error) { await client.query('ROLLBACK').catch(()=>undefined); throw error; } finally { client.release(); }
}

export async function listForEmployee(employeeId:string) { return (await db.query<EventRow>(`SELECT ${eventColumns} FROM time_events WHERE employee_id=$1 ORDER BY recorded_at DESC,id DESC`,[employeeId])).rows.map(toEvent); }

export async function createKioskSession(siteId:string,expiresInMinutes:number,userId:string,correlationId:string) {
  const client=await db.connect(); try { await client.query('BEGIN'); const valid=await client.query('SELECT s.id FROM sites s JOIN companies c ON c.id=s.company_id WHERE s.id=$1 AND s.is_active AND c.is_active AND c.environment_id=$2',[siteId,config.ENVIRONMENT_ID]); if(!valid.rowCount) throw new Error('KIOSK_SITE_NOT_FOUND');
    const row=(await client.query<{id:string;publicId:string;expiresAt:Date}>('INSERT INTO kiosk_sessions(site_id,expires_at,created_by_user_id) VALUES($1,clock_timestamp()+($2 * interval \'1 minute\'),$3) RETURNING id,public_id AS "publicId",expires_at AS "expiresAt"',[siteId,expiresInMinutes,userId])).rows[0];
    await appendAudit(client,{actorType:'user',actorId:userId,action:'kiosk.session.created',resourceType:'kiosk-session',resourceId:row.id,result:'success',correlationId,changes:{siteId,expiresAt:row.expiresAt.toISOString()}}); await client.query('COMMIT'); return {...row,expiresAt:row.expiresAt.toISOString()};
  } catch(e) {await client.query('ROLLBACK').catch(()=>undefined);throw e;} finally {client.release();}
}

export async function createQrChallenge(publicKioskId:string) {
  const token=randomBytes(32).toString('base64url'); const result=await db.query<{expiresAt:Date}>(`INSERT INTO kiosk_qr_challenges(kiosk_session_id,token_hash,expires_at)
    SELECT id,$2,LEAST(expires_at,clock_timestamp()+interval '2 minutes') FROM kiosk_sessions WHERE public_id=$1 AND status='active' AND expires_at>clock_timestamp() RETURNING expires_at AS "expiresAt"`,[publicKioskId,sha256(token)]);
  if(!result.rowCount) throw new Error('KIOSK_UNAVAILABLE'); return {token,expiresAt:result.rows[0].expiresAt.toISOString()};
}

export async function employeeForQr(challenge:string) { const result=await db.query<{employeeId:string;sessionId:string}>(`SELECT NULL::uuid AS "employeeId",q.kiosk_session_id AS "sessionId" FROM kiosk_qr_challenges q JOIN kiosk_sessions s ON s.id=q.kiosk_session_id WHERE q.token_hash=$1 AND q.expires_at>clock_timestamp() AND s.status='active' AND s.expires_at>clock_timestamp()`,[sha256(challenge)]); return result.rows[0]??null; }

export async function principalForPin(publicKioskId:string,pin:string,correlationId:string):Promise<Principal|null> {
  const candidate=await db.query<{employeeId:string;pinHash:string;locked:boolean;sessionId:string}>(`SELECT p.employee_id AS "employeeId",p.pin_hash AS "pinHash",(p.locked_until IS NOT NULL AND p.locked_until>clock_timestamp()) AS locked,s.id AS "sessionId" FROM employee_kiosk_pins p JOIN employees e ON e.id=p.employee_id JOIN companies c ON c.id=e.company_id JOIN kiosk_sessions s ON s.site_id IN (SELECT em.site_id FROM employments em WHERE em.employee_id=e.id AND em.effective_from<= (clock_timestamp() AT TIME ZONE (SELECT time_zone FROM sites WHERE id=s.site_id))::date AND (em.effective_to IS NULL OR em.effective_to>(clock_timestamp() AT TIME ZONE (SELECT time_zone FROM sites WHERE id=s.site_id))::date)) WHERE s.public_id=$1 AND s.status='active' AND s.expires_at>clock_timestamp() AND c.environment_id=$2 AND e.is_active AND p.lookup_hmac=$3`,[publicKioskId,config.ENVIRONMENT_ID,pinLookup(pin)]);
  const item=candidate.rows[0]; const valid=!!item&&!item.locked&&await verify(item.pinHash,pin);
  if(!valid) { if(item) await db.query(`UPDATE employee_kiosk_pins SET failed_attempts=failed_attempts+1,locked_until=CASE WHEN failed_attempts+1>=5 THEN clock_timestamp()+interval '15 minutes' ELSE locked_until END WHERE employee_id=$1`,[item.employeeId]); await appendAuditEntry({actorType:'kiosk',action:'kiosk.pin.attempt',resourceType:'kiosk-session',result:'denied',correlationId,changes:{reason:'invalid_or_locked'}}); return null; }
  await db.query('UPDATE employee_kiosk_pins SET failed_attempts=0,locked_until=NULL WHERE employee_id=$1',[item.employeeId]); return {employeeId:item.employeeId,method:'kiosk_pin',kioskSessionId:item.sessionId};
}

export async function setEmployeePin(employeeId:string,pin:string,userId:string,correlationId:string) {
  const employee=await db.query('SELECT e.id FROM employees e JOIN companies c ON c.id=e.company_id WHERE e.id=$1 AND e.is_active AND c.environment_id=$2',[employeeId,config.ENVIRONMENT_ID]); if(!employee.rowCount) throw new Error('EMPLOYEE_NOT_FOUND');
  const pinHash=await hash(pin); await db.query(`INSERT INTO employee_kiosk_pins(employee_id,lookup_hmac,pin_hash,created_by_user_id) VALUES($1,$2,$3,$4) ON CONFLICT(employee_id) DO UPDATE SET lookup_hmac=EXCLUDED.lookup_hmac,pin_hash=EXCLUDED.pin_hash,failed_attempts=0,locked_until=NULL,rotated_at=clock_timestamp(),created_by_user_id=EXCLUDED.created_by_user_id`,[employeeId,pinLookup(pin),pinHash,userId]);
  const client=await db.connect();try{await client.query('BEGIN');await appendAudit(client,{actorType:'user',actorId:userId,action:'kiosk.pin.rotated',resourceType:'employee',resourceId:employeeId,result:'success',correlationId,changes:{}});await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
}
