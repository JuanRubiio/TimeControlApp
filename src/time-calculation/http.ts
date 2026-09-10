import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthorizationError, assertAuthorized, assertSiteScope, type ScopedActor } from '@/permissions/authorizer';
import { error } from '@/auth/http';

export const calculationQuery=z.object({employeeId:z.string().uuid(),laborDate:z.string().date()});
export const excessPolicyInput=z.object({ruleVersionId:z.string().uuid(),excessThresholdMinutes:z.number().int().min(0).max(1440)});
export function readFailure(actor:ScopedActor|null,cid:string,errorValue:unknown){
  if(errorValue instanceof AuthorizationError)return error(actor?'FORBIDDEN':'UNAUTHENTICATED',actor?'Acceso no autorizado.':'Se requiere autenticación.',actor?403:401,cid);
  const code=errorValue instanceof Error?errorValue.message:'';
  if(code==='CALCULATION_SOURCE_EMPTY')return error('NOT_FOUND','No hay eventos de fichaje para esa jornada.',404,cid);
  if(code==='RULE_VERSION_UNRESOLVABLE')return error('RULE_VERSION_UNRESOLVABLE','No se puede resolver la regla histórica de la jornada.',409,cid);
  if(code==='CALCULATION_POLICY_LOCKED')return error('CONFLICT','La política no puede cambiarse después de calcular con esa versión de regla.',409,cid);
  return error('INTERNAL_ERROR','No se pudo calcular la jornada.',500,cid);
}
export function json(data:unknown,cid:string,status=200){return NextResponse.json({data,correlationId:cid},{status,headers:{'x-correlation-id':cid}});}
export function assertCalculationScope(actor:ScopedActor,siteId:string,own:boolean,kind:'read'|'recalculate'){
  if(own && kind==='read') { assertAuthorized(actor,'time-calculation.read:self'); return; }
  assertAuthorized(actor,kind==='read'?'time-calculation.read:scope':'time-calculation.recalculate:scope'); assertSiteScope(actor,siteId);
}
