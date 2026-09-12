import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { passwordLogin } from '@/auth/service';
import { challengeCookie, error, sessionCookie } from '@/auth/http';
import { correlationId } from '@/shared/correlation';
export async function POST(request:NextRequest) { const cid=correlationId(); const parsed=z.object({email:z.string().email().max(254),password:z.string().min(12).max(1024)}).safeParse(await request.json().catch(()=>null)); if(!parsed.success)return error('VALIDATION_FAILED','Solicitud no válida.',422,cid); const outcome=await passwordLogin(parsed.data.email,parsed.data.password,cid); if(!outcome)return error('UNAUTHENTICATED','Credenciales no válidas.',401,cid); if(outcome.status==='authenticated'){const res=NextResponse.json({data:{mfaRequired:false,destination:outcome.destination},correlationId:cid}); sessionCookie(res,outcome.session.token,outcome.session.expiresAt);return res;} const res=NextResponse.json({data:{mfaRequired:true,enrollmentRequired:outcome.status==='mfa_enrollment_required',destination:outcome.destination},correlationId:cid}); challengeCookie(res,outcome.challenge); return res; }
