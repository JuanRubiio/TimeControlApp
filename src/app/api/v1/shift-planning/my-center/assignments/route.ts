import { NextRequest } from 'next/server';
import { assignmentInput } from '@/shift-planning/validation';
import { data, invalid, scopedSiteIds } from '@/company-people/http';
import { planningActor, planningFailure } from '@/shift-planning/http';
import { publishAssignment } from '@/shift-planning/service';

export async function POST(request:NextRequest){const auth=await planningActor(request,'shift-planning.publish:scope');if('response'in auth)return auth.response;const parsed=assignmentInput.safeParse(await request.json().catch(()=>null));if(!parsed.success)return invalid(auth.cid);try{return data(await publishAssignment(parsed.data,{actor:auth.actor,correlationId:auth.cid},scopedSiteIds(auth.actor)),auth.cid,201);}catch(value){return planningFailure(value,auth.cid);}}
