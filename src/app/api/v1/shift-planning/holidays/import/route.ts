import { NextRequest } from 'next/server';
import { data, invalid } from '@/company-people/http';
import { planningActor, planningFailure } from '@/shift-planning/http';
import { importHolidays } from '@/shift-planning/service';
import { holidayImportInput } from '@/shift-planning/validation';

export async function POST(request:NextRequest){const auth=await planningActor(request,'shift-planning.write');if('response'in auth)return auth.response;const parsed=holidayImportInput.safeParse(await request.json().catch(()=>null));if(!parsed.success)return invalid(auth.cid);try{return data(await importHolidays(parsed.data,{actor:auth.actor,correlationId:auth.cid}),auth.cid,201);}catch(value){return planningFailure(value,auth.cid);}}
