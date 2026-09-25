import { NextRequest } from 'next/server';
import { authenticated,data,invalid } from '@/company-people/http';
import { onboardingConfirmInput } from '@/onboarding/schemas';
import { confirmOnboarding } from '@/onboarding/service';
import { error } from '@/auth/http';
import { z } from 'zod';

export async function POST(request:NextRequest){const access=await authenticated(request,'employee.write');if('response'in access)return access.response;if(!access.actor.permissions.has('employment.write'))return error('FORBIDDEN','Acceso no autorizado.',403,access.cid);const key=z.string().uuid().safeParse(request.headers.get('idempotency-key'));const parsed=onboardingConfirmInput.safeParse(await request.json().catch(()=>null));if(!key.success||!parsed.success)return invalid(access.cid);try{return data(await confirmOnboarding(access.actor,parsed.data,key.data,access.cid),access.cid,201);}catch(value){const code=value instanceof Error?value.message:'ONBOARDING_FAILED';return error(code==='ONBOARDING_ROW_INVALID'?'VALIDATION_FAILED':code,'No se pudo confirmar esta fila.',code==='ONBOARDING_ROW_INVALID'?422:409,access.cid);}}
