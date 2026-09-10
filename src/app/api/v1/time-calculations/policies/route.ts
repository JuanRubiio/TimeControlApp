import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { assertAuthorized } from '@/permissions/authorizer';
import { configureExcessPolicy } from '@/time-calculation/service';
import { excessPolicyInput, json, readFailure } from '@/time-calculation/http';
export async function POST(request:NextRequest){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');const parsed=excessPolicyInput.safeParse(await request.json().catch(()=>null));if(!parsed.success)return readFailure(actor,cid,new Error('BAD_REQUEST'));try{assertAuthorized(actor,'time-calculation.configure');return json({policy:await configureExcessPolicy(parsed.data.ruleVersionId,parsed.data.excessThresholdMinutes,actor!.id,cid)},cid,201);}catch(error){return readFailure(actor,cid,error);}}
