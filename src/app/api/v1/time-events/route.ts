import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { error } from '@/auth/http';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { assertAuthorized, AuthorizationError } from '@/permissions/authorizer';
import { assertIdempotencyKey, timeEventCommand } from '@/time-events/validation';
import { employeeForUser, listForEmployee, recordEvent } from '@/time-events/service';
import { failure, response } from '@/time-events/http';

async function actorFor(request:NextRequest,permission:'time-event.create:self'|'time-event.read:self',cid:string) { const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');try{assertAuthorized(actor,permission);return {actor};}catch(e){if(e instanceof AuthorizationError)return {response:error(actor?'FORBIDDEN':'UNAUTHENTICATED',actor?'Acceso no autorizado.':'Se requiere autenticación.',actor?403:401,cid)};throw e;} }
export async function GET(request:NextRequest) {const cid=correlationId();const access=await actorFor(request,'time-event.read:self',cid);if('response'in access)return access.response;const employeeId=await employeeForUser(access.actor.id);return response({events:employeeId?await listForEmployee(employeeId):[]},cid);}
export async function POST(request:NextRequest) {const cid=correlationId();const access=await actorFor(request,'time-event.create:self',cid);if('response'in access)return access.response;const command=timeEventCommand.safeParse(await request.json().catch(()=>null));if(!command.success)return error('VALIDATION_FAILED','La solicitud de fichaje no es válida.',422,cid);const employeeId=await employeeForUser(access.actor.id);if(!employeeId)return error('FORBIDDEN','No existe una ficha de empleado activa para fichar.',403,cid);try {const result=await recordEvent({employeeId,method:'web',userId:access.actor.id},command.data.eventType,command.data.deviceOccurredAt,assertIdempotencyKey(request.headers.get('idempotency-key')),cid);return response(result,cid,result.replayed?200:201);}catch(e){return failure(e,cid);}}
