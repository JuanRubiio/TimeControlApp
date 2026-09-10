import { NextResponse } from 'next/server';
import { AuthorizationError } from '@/permissions/authorizer';
import { error } from '@/auth/http';

export function failure(value:unknown,cid:string) {
  if(value instanceof AuthorizationError) return error('FORBIDDEN','Acceso no autorizado.',403,cid);
  const code=value instanceof Error?value.message:'';
  if(code==='TIME_EVENT_SEQUENCE_INVALID') return error(code,'La operación no es válida para el estado actual del fichaje.',409,cid);
  if(code==='IDEMPOTENCY_CONFLICT') return error(code,'La clave de idempotencia ya se usó para otra operación.',409,cid);
  if(code==='IDEMPOTENCY_KEY_REQUIRED') return error('VALIDATION_FAILED','Se requiere una clave de idempotencia válida.',422,cid);
  if(code==='RULE_VERSION_UNRESOLVABLE') return error(code,'No hay una regla vigente aplicable para este fichaje.',409,cid);
  if(code==='EMPLOYMENT_NOT_ACTIVE') return error('FORBIDDEN','No existe una relación laboral activa para fichar.',403,cid);
  if(code==='KIOSK_UNAVAILABLE'||code==='KIOSK_SITE_NOT_FOUND') return error('NOT_FOUND','El kiosco no está disponible.',404,cid);
  if(code==='EMPLOYEE_NOT_FOUND') return error('NOT_FOUND','Empleado no encontrado.',404,cid);
  return error('INTERNAL_ERROR','No se pudo registrar el fichaje.',500,cid);
}
export function response(data:unknown,cid:string,status=200) { return NextResponse.json({data,correlationId:cid},{status,headers:{'x-correlation-id':cid}}); }
