import { NextRequest, NextResponse } from 'next/server';
import { authenticated, data, invalid } from '@/company-people/http';
import { previewOfficialHolidays } from '@/holiday-sources/service';
import { z } from 'zod';

const input=z.object({sourceId:z.string().min(1),community:z.string().trim().min(1).max(120),year:z.number().int().min(2020).max(2100)});
export async function POST(request:NextRequest){const access=await authenticated(request,'shift-planning.write');if('response'in access)return access.response;const parsed=input.safeParse(await request.json().catch(()=>null));if(!parsed.success)return invalid(access.cid);try{return data(await previewOfficialHolidays(parsed.data.sourceId,parsed.data.community,parsed.data.year),access.cid);}catch(error){const code=error instanceof Error?error.message:'';const message=code==='HOLIDAY_SOURCE_YEAR_UNAVAILABLE'?'El calendario BOE de ese año todavía no está disponible.':'No se pudo consultar el BOE ahora mismo.';return NextResponse.json({error:{code:code||'HOLIDAY_SOURCE_UNAVAILABLE',message},correlationId:access.cid},{status:code==='HOLIDAY_SOURCE_NOT_FOUND'?404:503});}}
