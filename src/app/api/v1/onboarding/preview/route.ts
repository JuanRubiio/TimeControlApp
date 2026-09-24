import { NextRequest } from 'next/server';
import { authenticated,data,invalid } from '@/company-people/http';
import { onboardingPreviewInput } from '@/onboarding/schemas';
import { previewOnboarding } from '@/onboarding/service';
import { error } from '@/auth/http';
export async function POST(request:NextRequest){const access=await authenticated(request,'employee.write');if('response'in access)return access.response;if(!access.actor.permissions.has('employment.write'))return error('FORBIDDEN','Acceso no autorizado.',403,access.cid);const parsed=onboardingPreviewInput.safeParse(await request.json().catch(()=>null));return parsed.success?data({rows:await previewOnboarding(parsed.data.rows)},access.cid):invalid(access.cid);}
