import { NextRequest } from 'next/server';
import { authenticated } from '@/company-people/http';
import { error } from '@/auth/http';
import { appendAudit } from '@/audit/audit-writer';

export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}) {
  const auth=await authenticated(request,'export.read:scope');
  if ('response' in auth) return auth.response;
  const id=(await params).id;
  await appendAudit({actorType:'user',actorId:auth.actor.id,action:'export.download',resourceType:'export',resourceId:id,result:'denied',correlationId:auth.cid,changes:{reason:'S15_NOT_CLOSED'}});
  return error('EXPORTS_LOCKED','Exportaciones permanece bloqueado hasta el cierre verificable de S15.',409,auth.cid);
}
