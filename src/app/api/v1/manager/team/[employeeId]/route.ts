import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { AuthorizationError } from '@/permissions/authorizer';
import { error } from '@/auth/http';
import { data } from '@/company-people/http';
import { teamPersonDetail } from '@/manager/team-service';

export async function GET(request:NextRequest,{params}:{params:Promise<{employeeId:string}>}){
  const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');
  if(!actor)return error('UNAUTHENTICATED','Se requiere autenticación.',401,cid);
  try{return data({person:await teamPersonDetail(actor,(await params).employeeId)},cid);}
  catch(value){if(value instanceof AuthorizationError)return error('FORBIDDEN','Acceso no autorizado.',403,cid);throw value;}
}
