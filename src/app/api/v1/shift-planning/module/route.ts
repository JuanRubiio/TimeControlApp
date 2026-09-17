import { NextRequest } from 'next/server';
import { moduleRead, planningActor, planningFailure } from '@/shift-planning/http';
import { setModuleStatus } from '@/shift-planning/service';
import { moduleStatusInput } from '@/shift-planning/validation';
import { data, invalid } from '@/company-people/http';
export async function GET(request:NextRequest){return moduleRead(request);}
export async function POST(request:NextRequest){const auth=await planningActor(request,'shift-planning.write');if('response'in auth)return auth.response;const parsed=moduleStatusInput.safeParse(await request.json().catch(()=>null));if(!parsed.success)return invalid(auth.cid);try{return data(await setModuleStatus(parsed.data,{actor:auth.actor,correlationId:auth.cid}),auth.cid);}catch(value){return planningFailure(value,auth.cid);}}
