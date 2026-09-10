import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { decideCorrection } from '@/corrections/service';
import { decisionInput,idempotencyKey } from '@/corrections/validation';
import { failure,response } from '@/corrections/http';
import { recalculateDaily } from '@/time-calculation/service';
export async function POST(request:NextRequest,{params}:{params:Promise<{id:string}>}){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');if(!actor)return failure(null,cid,new Error('FORBIDDEN'));const input=decisionInput.safeParse(await request.json().catch(()=>null));if(!input.success)return response({code:'VALIDATION_FAILED',message:'La decisión no es válida.'},cid,422);try{const result=await decideCorrection(actor,(await params).id,input.data,idempotencyKey(request.headers.get('idempotency-key')),cid);let recalculation=null;if(result.correction.status==='approved'&&!result.replayed)recalculation=await recalculateDaily(result.correction.employeeId,result.correction.laborDate,actor.id,cid);return response({...result,recalculation},cid,result.replayed?200:201);}catch(e){return failure(actor,cid,e);}}
