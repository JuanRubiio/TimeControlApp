import { NextRequest, NextResponse } from 'next/server';
import { currentActor } from '@/auth/service';
import { error } from '@/auth/http';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { assertAuthorized, assertSiteScope, AuthorizationError, type ScopedActor } from '@/permissions/authorizer';
import type { Permission } from '@/permissions/catalog';
import * as service from './service';

export async function authenticated(request:NextRequest, permission:Permission) {
  const cid=correlationId(); const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value ?? '');
  try { assertAuthorized(actor,permission); return { actor, cid }; }
  catch (value) { if(value instanceof AuthorizationError) return { response:error(actor?'FORBIDDEN':'UNAUTHENTICATED',actor?'Acceso no autorizado.':'Se requiere autenticación.',actor?403:401,cid) }; throw value; }
}
export async function authenticatedAny(request:NextRequest, permissions:readonly Permission[]) {
  const cid=correlationId(); const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value ?? '');
  if (actor && permissions.some((permission)=>actor.permissions.has(permission))) return {actor,cid};
  return {response:error(actor?'FORBIDDEN':'UNAUTHENTICATED',actor?'Acceso no autorizado.':'Se requiere autenticación.',actor?403:401,cid)};
}
export function scopedSiteIds(actor:ScopedActor) { return actor.scopes?.filter((scope)=>scope.type==='site' && scope.id).map((scope)=>scope.id!) ?? []; }
export function hasEnvironmentScope(actor:ScopedActor) { return actor.scopes?.some((scope)=>scope.type==='environment') ?? false; }
export const invalid=(cid:string)=>error('VALIDATION_FAILED','Solicitud no válida.',422,cid);
export const missing=(cid:string)=>error('NOT_FOUND','Recurso no encontrado.',404,cid);
export function data(data:unknown,cid:string,status=200) { return NextResponse.json({data,correlationId:cid},{status,headers:{'x-correlation-id':cid}}); }
export async function canReadEmployee(actor:ScopedActor, employee:{id:string;userId:string|null}, cid:string) {
  if (actor.permissions.has('employee.read:self') && employee.userId===actor.id) return true;
  if (!actor.permissions.has('employee.read:scope')) return false;
  const employments=await service.listEmployments(employee.id);
  for(const employment of employments) { try { assertSiteScope(actor,employment.siteId); return true; } catch { /* try another assigned site */ } }
  return false;
}
