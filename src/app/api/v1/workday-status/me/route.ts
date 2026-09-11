import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { ownWorkdayStatus } from '@/workday-status/service';
import { workdayStatusFailure, workdayStatusResponse } from '@/workday-status/http';

export async function GET(request:NextRequest){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');if(!actor)return workdayStatusFailure(null,cid,new Error('UNAUTHENTICATED'));try{return workdayStatusResponse(await ownWorkdayStatus(actor),cid);}catch(error){return workdayStatusFailure(actor,cid,error);}}
