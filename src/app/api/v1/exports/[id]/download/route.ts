import { NextRequest, NextResponse } from 'next/server';
import { authenticated } from '@/company-people/http';
import { downloadExport } from '@/exports/service';
import { AuthorizationError } from '@/permissions/authorizer';
import { error } from '@/auth/http';
import { appendAudit } from '@/audit/audit-writer';

export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}) {
  const auth=await authenticated(request,'export.read:scope');
  if ('response' in auth) return auth.response;
  const id=(await params).id;
  try {
    const item=await downloadExport(auth.actor,id,auth.cid);
    return new NextResponse(item.bytes,{headers:{
      'content-type':item.format==='csv'?'text/csv; charset=utf-8':'application/pdf',
      'content-disposition':`attachment; filename="registro-jornada.${item.format}"`,
      'x-correlation-id':auth.cid
    }});
  } catch (value) {
    const denied=value instanceof AuthorizationError || value instanceof Error && ['FORBIDDEN','EXPORT_NOT_FOUND'].includes(value.message);
    await appendAudit({actorType:'user',actorId:auth.actor.id,action:'export.download',resourceType:'export',resourceId:id,result:denied?'denied':'failure',correlationId:auth.cid,changes:{reason:value instanceof Error?value.message:'unknown'}});
    if (denied) return error('FORBIDDEN','Acceso no autorizado.',403,auth.cid);
    if (value instanceof Error && value.message==='EXPORT_EXPIRED') return error('NOT_FOUND','La exportación ya no está disponible.',404,auth.cid);
    throw value;
  }
}
