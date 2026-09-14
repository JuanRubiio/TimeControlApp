import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { ownPublishedWorkday } from '@/published-workday/service';
import { publishedWorkdayFailure, publishedWorkdayResponse } from '@/published-workday/http';

export async function GET(request:NextRequest){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');if(!actor)return publishedWorkdayFailure(null,cid,new Error('UNAUTHENTICATED'));try{return publishedWorkdayResponse(await ownPublishedWorkday(actor),cid);}catch(error){return publishedWorkdayFailure(actor,cid,error);}}
