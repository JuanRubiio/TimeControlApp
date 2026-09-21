import { NextResponse } from 'next/server';
import { z } from 'zod';
import { AuthorizationError,type ScopedActor } from '@/permissions/authorizer';
import { error } from '@/auth/http';
export const monthlyReviewInput=z.object({period:z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)});
export const reviewKey=z.string().uuid();
export function monthlyReviewFailure(actor:ScopedActor|null,cid:string,value:unknown){if(value instanceof AuthorizationError)return error(actor?'FORBIDDEN':'UNAUTHENTICATED',actor?'Acceso no autorizado.':'Se requiere autenticación.',actor?403:401,cid);const code=value instanceof Error?value.message:'';if(code==='MONTHLY_REVIEW_MODULE_INACTIVE')return error('MODULE_INACTIVE','Active el módulo de balance informativo desde Configuración antes de acceder a esta funcionalidad.',409,cid);if(code==='MONTHLY_REVIEW_PERIOD_INVALID')return error('PERIOD_INVALID','Seleccione uno de los últimos doce meses cerrados.',422,cid);if(code==='MONTHLY_REVIEW_EMPTY')return error('MONTHLY_REVIEW_EMPTY','No hay cálculos ni excepciones para revisar en este período.',409,cid);if(code==='MONTHLY_REVIEW_NOT_FOUND')return error('NOT_FOUND','No se pudo preparar la revisión mensual.',404,cid);return error('INTERNAL_ERROR','No se pudo consultar la revisión mensual.',500,cid);}
export const data=(value:unknown,cid:string,status=200)=>NextResponse.json({data:value,correlationId:cid},{status,headers:{'x-correlation-id':cid}});
