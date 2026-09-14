import { NextResponse } from 'next/server';
import type { ScopedActor } from '@/permissions/authorizer';
import { AuthorizationError } from '@/permissions/authorizer';
import { error } from '@/auth/http';

export function publishedWorkdayFailure(actor:ScopedActor|null,cid:string,value:unknown){
  if(!actor)return error('UNAUTHENTICATED','Se requiere autenticación.',401,cid);
  if(value instanceof AuthorizationError)return error('FORBIDDEN','Acceso no autorizado.',403,cid);
  if(value instanceof Error&&value.message==='PUBLISHED_WORKDAY_NOT_FOUND')return error('NOT_FOUND','No hay una jornada publicada disponible para consultar.',404,cid);
  return error('INTERNAL_ERROR','No se pudo consultar la jornada publicada.',500,cid);
}
export const publishedWorkdayResponse=(data:unknown,cid:string)=>NextResponse.json({data,correlationId:cid},{headers:{'x-correlation-id':cid}});
