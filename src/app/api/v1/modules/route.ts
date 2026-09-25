import { NextRequest,NextResponse } from 'next/server';
import { authenticated,data,invalid } from '@/company-people/http';
import { z } from 'zod';
import { listProductModules,setProductModule } from '@/modules/service';
const input=z.object({key:z.enum(['shift_planning','people_management','exports','informative_hour_balance']),action:z.enum(['install','retire'])});
export async function GET(request:NextRequest){const auth=await authenticated(request,'shift-planning.write');if('response'in auth)return auth.response;return data(await listProductModules(),auth.cid);}
export async function POST(request:NextRequest){const auth=await authenticated(request,'shift-planning.write');if('response'in auth)return auth.response;const parsed=input.safeParse(await request.json().catch(()=>null));if(!parsed.success)return invalid(auth.cid);try{return data(await setProductModule(parsed.data.key,parsed.data.action,auth.actor,auth.cid),auth.cid);}catch(error){return NextResponse.json({error:{code:'MODULE_NOT_CONFIGURED',message:'No se pudo actualizar el módulo.'},correlationId:auth.cid},{status:409});}}
