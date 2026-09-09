import { NextResponse } from 'next/server';
import { config } from '@/shared/config';
export const sessionCookie = (response: NextResponse, token: string, expiresAt: Date) => response.cookies.set(config.SESSION_COOKIE_NAME, token, { httpOnly:true, secure:process.env.NODE_ENV === 'production', sameSite:'lax', path:'/', expires:expiresAt });
export const clearSessionCookie = (response: NextResponse) => response.cookies.set(config.SESSION_COOKIE_NAME, '', { httpOnly:true, secure:process.env.NODE_ENV === 'production', sameSite:'lax', path:'/', maxAge:0 });
export const challengeCookie = (response: NextResponse, token: string) => response.cookies.set('tc_mfa_challenge', token, { httpOnly:true, secure:process.env.NODE_ENV === 'production', sameSite:'strict', path:'/api/v1/auth/mfa', maxAge:300 });
export const error = (code:string, message:string, status:number, correlationId:string) => NextResponse.json({error:{code,message},correlationId},{status,headers:{'x-correlation-id':correlationId}});
