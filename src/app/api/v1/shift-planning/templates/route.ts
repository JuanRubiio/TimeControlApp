import { NextRequest } from 'next/server';
import { planningActor, planningFailure } from '@/shift-planning/http';
import { createTemplate, listTemplates } from '@/shift-planning/service';
import { templateInput } from '@/shift-planning/validation';
import { data, invalid } from '@/company-people/http';
export async function GET(request:NextRequest){const auth=await planningActor(request,'shift-planning.read');if('response'in auth)return auth.response;return data(await listTemplates(),auth.cid);}
export async function POST(request:NextRequest){const auth=await planningActor(request,'shift-planning.write');if('response'in auth)return auth.response;const parsed=templateInput.safeParse(await request.json().catch(()=>null));if(!parsed.success)return invalid(auth.cid);try{return data(await createTemplate(parsed.data,{actor:auth.actor,correlationId:auth.cid}),auth.cid,201);}catch(value){return planningFailure(value,auth.cid);}}
