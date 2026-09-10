import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { AuthorizationError } from '@/permissions/authorizer';
import { error } from '@/auth/http';
import { listWorkdays, workdayQuery } from '@/admin/service';
import { data } from '@/company-people/http';

export async function GET(request:NextRequest){
  const cid=correlationId(); const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');
  if(!actor)return error('UNAUTHENTICATED','Se requiere autenticación.',401,cid);
  const query=workdayQuery.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if(!query.success)return error('VALIDATION_FAILED','Los filtros de jornada no son válidos.',422,cid);
  try{return data({workdays:await listWorkdays(actor,query.data)},cid);}
  catch(value){if(value instanceof AuthorizationError)return error('FORBIDDEN','Acceso no autorizado.',403,cid);throw value;}
}
