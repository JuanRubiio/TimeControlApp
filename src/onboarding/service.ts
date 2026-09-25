import { createHash } from 'node:crypto';
import { db } from '@/shared/db';
import { config } from '@/shared/config';
import { appendAudit } from '@/audit/audit-writer';
import type { ScopedActor } from '@/permissions/authorizer';
import type { OnboardingRow } from './schemas';

export type OnboardingPreview={rowId:string;status:'ready'|'needs_review'|'error';messages:string[]};
const fingerprint=(value:unknown)=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const normal=(value:string)=>value.trim().toLocaleLowerCase('es-ES');
async function inspect(row:OnboardingRow,seen?:Set<string>):Promise<OnboardingPreview>{
  const messages:string[]=[];const site=(await db.query<{ok:boolean}>(`SELECT EXISTS(SELECT 1 FROM sites s JOIN companies c ON c.id=s.company_id WHERE s.id=$1 AND s.is_active AND c.is_active AND c.environment_id=$2) AS ok`,[row.siteId,config.ENVIRONMENT_ID])).rows[0]?.ok;
  if(!site)messages.push('El centro no está disponible.');
  if(row.managerEmployeeId){const manager=(await db.query<{ok:boolean}>(`SELECT EXISTS(SELECT 1 FROM employees e JOIN employments em ON em.employee_id=e.id JOIN companies c ON c.id=e.company_id WHERE e.id=$1 AND em.site_id=$2 AND e.is_active AND c.environment_id=$3 AND em.effective_from<=$4::date AND (em.effective_to IS NULL OR em.effective_to>$4::date)) AS ok`,[row.managerEmployeeId,row.siteId,config.ENVIRONMENT_ID,row.effectiveFrom])).rows[0]?.ok;if(!manager)messages.push('El responsable no está vigente en ese centro para la fecha indicada.');}
  const name=normal(row.displayName);if(seen?.has(name))messages.push('Hay otra fila con el mismo nombre visible.');seen?.add(name);
  const existing=(await db.query<{exists:boolean}>(`SELECT EXISTS(SELECT 1 FROM employees e JOIN companies c ON c.id=e.company_id WHERE c.environment_id=$1 AND e.is_active AND lower(trim(e.display_name))=lower(trim($2))) AS exists`,[config.ENVIRONMENT_ID,row.displayName])).rows[0]?.exists;
  if(messages.length)return {rowId:row.rowId,status:'error',messages};
  return existing?{rowId:row.rowId,status:'needs_review',messages:['Existe una persona activa con el mismo nombre visible. Revise la fila antes de confirmar.']}:{rowId:row.rowId,status:'ready',messages:['Lista para confirmar. No se creará una cuenta de acceso.']};
}
export async function previewOnboarding(rows:OnboardingRow[]){const seen=new Set<string>();return Promise.all(rows.map(row=>inspect(row,seen)));}
export async function confirmOnboarding(actor:ScopedActor,row:OnboardingRow,key:string,cid:string){const client=await db.connect();try{await client.query('BEGIN');const prior=await client.query<{request_fingerprint:string;response:{employeeId:string;employmentId:string}}>(`SELECT request_fingerprint,response FROM onboarding_confirmation_idempotency WHERE environment_id=$1 AND actor_user_id=$2 AND idempotency_key=$3`,[config.ENVIRONMENT_ID,actor.id,key]);const hash=fingerprint(row);if(prior.rowCount){if(prior.rows[0].request_fingerprint!==hash)throw new Error('IDEMPOTENCY_CONFLICT');await client.query('COMMIT');return {...prior.rows[0].response,replayed:true};}
  const result=await inspect(row);if(result.status!=='ready')throw new Error('ONBOARDING_ROW_INVALID');
  const employee=(await client.query<{id:string}>(`INSERT INTO employees(company_id,display_name) SELECT id,$2 FROM companies WHERE environment_id=$1 AND is_active RETURNING id`,[config.ENVIRONMENT_ID,row.displayName])).rows[0];if(!employee)throw new Error('ONBOARDING_UNAVAILABLE');
  const employment=(await client.query<{id:string}>(`INSERT INTO employments(employee_id,site_id,manager_employee_id,effective_from) VALUES($1,$2,$3,$4) RETURNING id`,[employee.id,row.siteId,row.managerEmployeeId,row.effectiveFrom])).rows[0];const response={employeeId:employee.id,employmentId:employment.id};
  await client.query(`INSERT INTO onboarding_confirmation_idempotency(environment_id,actor_user_id,idempotency_key,request_fingerprint,response) VALUES($1,$2,$3,$4,$5)`,[config.ENVIRONMENT_ID,actor.id,key,hash,JSON.stringify(response)]);
  await appendAudit({actorType:'user',actorId:actor.id,action:'onboarding.row.confirmed',resourceType:'employment',resourceId:employment.id,result:'success',correlationId:cid,changes:{siteId:row.siteId,hasManager:!!row.managerEmployeeId,effectiveFrom:row.effectiveFrom,syntheticPreparation:true}});
  await client.query('COMMIT');return {...response,replayed:false};
}catch(error){await client.query('ROLLBACK').catch(()=>undefined);throw error;}finally{client.release();}}
