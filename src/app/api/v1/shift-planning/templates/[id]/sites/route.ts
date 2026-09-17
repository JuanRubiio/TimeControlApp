import { NextRequest } from 'next/server';
import { z } from 'zod';
import { data, invalid } from '@/company-people/http';
import { planningActor, planningFailure } from '@/shift-planning/http';
import { setTemplateSites } from '@/shift-planning/service';

const input = z.object({ siteIds: z.array(z.string().uuid()).max(100) });

export async function POST(request:NextRequest,{params}:{params:Promise<{id:string}>}){const auth=await planningActor(request,'shift-planning.write');if('response'in auth)return auth.response;const parsed=input.safeParse(await request.json().catch(()=>null));if(!parsed.success)return invalid(auth.cid);try{return data(await setTemplateSites((await params).id,parsed.data.siteIds,{actor:auth.actor,correlationId:auth.cid}),auth.cid);}catch(value){return planningFailure(value,auth.cid);}}
