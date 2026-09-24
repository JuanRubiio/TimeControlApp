import { db } from '@/shared/db';
import { config } from '@/shared/config';
import { appendAudit } from '@/audit/audit-writer';
import type { ScopedActor } from '@/permissions/authorizer';
import { PRODUCT_MODULES,type ModuleKey,type ModuleStatus } from './catalog';

const company=async()=> (await db.query<{id:string}>('SELECT id FROM companies WHERE environment_id=$1 AND is_active',[config.ENVIRONMENT_ID])).rows[0]??null;
export async function listProductModules(){const c=await company();const rows=c?(await db.query<{moduleKey:ModuleKey;status:ModuleStatus}>('SELECT module_key AS "moduleKey",status FROM company_modules WHERE company_id=$1 AND module_key=ANY($2::text[])',[c.id,PRODUCT_MODULES.map(module=>module.key)])).rows:[];const status=new Map(rows.map(row=>[row.moduleKey,row.status]));return PRODUCT_MODULES.map(module=>({...module,status:status.get(module.key)??'disabled' as ModuleStatus}));}
export async function productModuleStatus(key:ModuleKey):Promise<ModuleStatus>{return (await listProductModules()).find(module=>module.key===key)?.status??'disabled';}
export async function setProductModule(key:ModuleKey,action:'install'|'retire',actor:ScopedActor,cid:string){if(!PRODUCT_MODULES.some(module=>module.key===key))throw new Error('MODULE_NOT_FOUND');const c=await company();if(!c)throw new Error('MODULE_NOT_CONFIGURED');const status:ModuleStatus=action==='install'?'active':'disabled';const row=(await db.query<{status:ModuleStatus}>(`INSERT INTO company_modules(company_id,module_key,status,updated_by_user_id) VALUES($1,$2,$3,$4) ON CONFLICT(company_id,module_key) DO UPDATE SET status=EXCLUDED.status,version=company_modules.version+1,updated_by_user_id=EXCLUDED.updated_by_user_id,updated_at=clock_timestamp() RETURNING status`,[c.id,key,status,actor.id])).rows[0];await appendAudit({actorType:'user',actorId:actor.id,action:action==='install'?'module.installed':'module.retired',resourceType:'company-module',resourceId:`${c.id}:${key}`,result:'success',correlationId:cid,changes:{module:key,status:row.status}});return row;}
export async function assertExportsLocked(){throw new Error('EXPORTS_LOCKED');}
