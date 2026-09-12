import { NextResponse } from 'next/server';
import type { ScopedActor } from '@/permissions/authorizer';
import { AuthorizationError } from '@/permissions/authorizer';
import { error } from '@/auth/http';

export function workdayStatusFailure(actor:ScopedActor|null,cid:string,value:unknown){
  if(!actor)return error('UNAUTHENTICATED','Se requiere autenticación.',401,cid);
  if(value instanceof AuthorizationError)return error(actor?'FORBIDDEN':'UNAUTHENTICATED',actor?'Acceso no autorizado.':'Se requiere autenticación.',actor?403:401,cid);
  if(value instanceof Error&&value.message==='WORKDAY_STATUS_NOT_FOUND')return error('NOT_FOUND','No hay una jornada disponible para consultar.',404,cid);
  return error('INTERNAL_ERROR','No se pudo consultar el estado de la jornada.',500,cid);
}
export const workdayStatusResponse=(data:unknown,cid:string)=>NextResponse.json({data,correlationId:cid},{headers:{'x-correlation-id':cid}});
