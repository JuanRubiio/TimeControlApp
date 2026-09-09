import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/shared/db';
import { createTotpSecret, totpUri } from '@/auth/totp';
import { correlationId } from '@/shared/correlation';
import { error } from '@/auth/http';
import { createHash } from 'node:crypto';
export async function POST(request:NextRequest) { const cid=correlationId(); const token=request.cookies.get('tc_mfa_challenge')?.value; if(!token)return error('UNAUTHENTICATED','Se requiere autenticación primaria.',401,cid); const hash=createHash('sha256').update(token).digest('hex'); const q=await db.query<{user_id:string,email:string,mfa_secret:string|null}>(`SELECT c.user_id,u.email,u.mfa_secret FROM auth_challenges c JOIN users u ON u.id=c.user_id WHERE c.token_hash=$1 AND c.purpose='mfa_enroll' AND c.consumed_at IS NULL AND c.expires_at>clock_timestamp()`,[hash]); const row=q.rows[0]; if(!row)return error('UNAUTHENTICATED','El desafío ya no es válido.',401,cid); const secret=row.mfa_secret ?? createTotpSecret(); if(!row.mfa_secret) await db.query('UPDATE users SET mfa_secret=$1,updated_at=clock_timestamp() WHERE id=$2',[secret,row.user_id]); return NextResponse.json({data:{otpauthUri:totpUri(secret,row.email)},correlationId:cid}); }
