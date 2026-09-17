import { NextRequest,NextResponse } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { AuthorizationError } from '@/permissions/authorizer';
import { error } from '@/auth/http';
import { ownEmployeeHome } from '@/employee-home/service';

export async function GET(request:NextRequest){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');if(!actor)return error('UNAUTHENTICATED','Se requiere autenticación.',401,cid);try{return NextResponse.json({data:await ownEmployeeHome(actor),correlationId:cid},{headers:{'x-correlation-id':cid}});}catch(value){if(value instanceof AuthorizationError)return error('FORBIDDEN','Acceso no autorizado.',403,cid);if(value instanceof Error&&value.message==='EMPLOYEE_HOME_NOT_FOUND')return error('NOT_FOUND','No hay una jornada personal disponible para consultar.',404,cid);return error('INTERNAL_ERROR','No se pudo consultar el inicio personal.',500,cid);}}
