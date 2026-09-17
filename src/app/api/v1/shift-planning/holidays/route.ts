import { NextRequest } from 'next/server';
import { data, invalid } from '@/company-people/http';
import { planningActor, planningFailure } from '@/shift-planning/http';
import { createHoliday, listHolidays } from '@/shift-planning/service';
import { holidayInput } from '@/shift-planning/validation';

export async function GET(request:NextRequest){const auth=await planningActor(request,'shift-planning.read');if('response'in auth)return auth.response;return data(await listHolidays(),auth.cid);}
export async function POST(request:NextRequest){const auth=await planningActor(request,'shift-planning.write');if('response'in auth)return auth.response;const parsed=holidayInput.safeParse(await request.json().catch(()=>null));if(!parsed.success)return invalid(auth.cid);try{return data(await createHoliday(parsed.data,{actor:auth.actor,correlationId:auth.cid}),auth.cid,201);}catch(value){return planningFailure(value,auth.cid);}}
