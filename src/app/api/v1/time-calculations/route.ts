import { NextRequest } from 'next/server';
import { currentActor } from '@/auth/service';
import { config } from '@/shared/config';
import { correlationId } from '@/shared/correlation';
import { employeeForUser } from '@/time-events/service';
import { calculationQuery, assertCalculationScope, json, readFailure } from '@/time-calculation/http';
import { currentCalculation, employeeSite, recalculateDaily } from '@/time-calculation/service';

function query(request:NextRequest){return calculationQuery.safeParse({employeeId:request.nextUrl.searchParams.get('employeeId'),laborDate:request.nextUrl.searchParams.get('laborDate')});}
export async function GET(request:NextRequest){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');const parsed=query(request);if(!parsed.success)return readFailure(actor,cid,new Error('BAD_REQUEST'));try{const own=(await employeeForUser(actor?.id??''))===parsed.data.employeeId;const siteId=await employeeSite(parsed.data.employeeId,parsed.data.laborDate);if(!siteId)throw new Error('CALCULATION_SOURCE_EMPTY');assertCalculationScope(actor!,siteId,own,'read');const calculation=await currentCalculation(parsed.data.employeeId,parsed.data.laborDate);if(!calculation)throw new Error('CALCULATION_SOURCE_EMPTY');return json({calculation},cid);}catch(e){return readFailure(actor,cid,e);}}
export async function POST(request:NextRequest){const cid=correlationId();const actor=await currentActor(request.cookies.get(config.SESSION_COOKIE_NAME)?.value??'');const parsed=calculationQuery.safeParse(await request.json().catch(()=>null));if(!parsed.success)return readFailure(actor,cid,new Error('BAD_REQUEST'));try{const siteId=await employeeSite(parsed.data.employeeId,parsed.data.laborDate);if(!siteId)throw new Error('CALCULATION_SOURCE_EMPTY');assertCalculationScope(actor!,siteId,false,'recalculate');const result=await recalculateDaily(parsed.data.employeeId,parsed.data.laborDate,actor!.id,cid);return json(result,cid,result.replayed?200:201);}catch(e){return readFailure(actor,cid,e);}}
