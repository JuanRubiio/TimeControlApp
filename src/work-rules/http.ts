import { NextRequest, NextResponse } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { assertAuthorized, AuthorizationError } from '@/permissions/authorizer'; import type { Permission } from '@/permissions/catalog';
import { correlationId } from '@/shared/correlation';
import { error } from '@/auth/http';
import { z } from 'zod';
export async function ruleActor(request:NextRequest,permission:Permission='rule.write'){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');try{assertAuthorized(actor,permission);return {actor,cid};}catch(e){if(e instanceof AuthorizationError)return {response:error(actor?'FORBIDDEN':'UNAUTHENTICATED',actor?'Acceso no autorizado.':'Se requiere autenticación.',actor?403:401,cid)};throw e;}}
export async function body<T extends z.ZodTypeAny>(request:NextRequest,schema:T,cid:string):Promise<{value:z.infer<T>}|{response:NextResponse}>{const parsed=schema.safeParse(await request.json().catch(()=>null));return parsed.success?{value:parsed.data}:{response:error('VALIDATION_FAILED','La configuración no es válida.',422,cid)};}
export function domainFailure(e:unknown,cid:string){const message=e instanceof Error?e.message:'';if(message==='INVALID_TIME_ZONE'||message==='INVALID_DATETIME')return error('VALIDATION_FAILED','La fecha, hora o zona no es válida.',422,cid);if(message==='CONFIGURATION_REFERENCE_NOT_FOUND')return error('NOT_FOUND','El calendario o turno indicado no existe.',404,cid);if((e as {code?:string}).code==='23P01')return error('CONFLICT','La vigencia se solapa con otra versión de esta regla.',409,cid);if((e as {code?:string}).code==='23505')return error('CONFLICT','Ya existe una configuración con esa identidad.',409,cid);throw e;}
