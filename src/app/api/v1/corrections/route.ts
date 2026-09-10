import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { employeeForUser } from '@/time-events/service';
import { createCorrection,listCorrections } from '@/corrections/service';
import { correctionInput } from '@/corrections/validation';
import { failure,response } from '@/corrections/http';
export async function GET(request:NextRequest){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');if(!actor)return failure(null,cid,new Error('FORBIDDEN'));try{const mine=request.nextUrl.searchParams.get('mine')==='true';const employeeId=mine?await employeeForUser(actor.id):request.nextUrl.searchParams.get('employeeId')??undefined;return response({corrections:await listCorrections(actor,employeeId)},cid);}catch(e){return failure(actor,cid,e);}}
export async function POST(request:NextRequest){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');if(!actor)return failure(null,cid,new Error('FORBIDDEN'));const input=correctionInput.safeParse(await request.json().catch(()=>null));if(!input.success)return response({code:'VALIDATION_FAILED',message:'La solicitud de corrección no es válida.'},cid,422);try{const employeeId=await employeeForUser(actor.id);if(!employeeId)throw new Error('CORRECTION_NOT_OWN');return response({correction:await createCorrection(actor,employeeId,input.data,cid)},cid,201);}catch(e){return failure(actor,cid,e);}}
