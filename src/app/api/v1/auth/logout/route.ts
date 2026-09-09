import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/shared/config'; import { revokeSession } from '@/auth/service'; import { clearSessionCookie } from '@/auth/http'; import { correlationId } from '@/shared/correlation';
export async function POST(request:NextRequest){const cid=correlationId();const token=request.cookies.get(config.SESSION_COOKIE_NAME)?.value;if(token)await revokeSession(token,cid);const res=NextResponse.json({data:{revoked:true},correlationId:cid});clearSessionCookie(res);return res;}
