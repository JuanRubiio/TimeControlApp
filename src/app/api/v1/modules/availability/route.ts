import { NextRequest,NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { config } from '@/shared/config';
import { currentActor } from '@/auth/service';
import { correlationId } from '@/shared/correlation';
import { listProductModules } from '@/modules/service';

export async function GET(_request:NextRequest){
  const cid=correlationId();
  const token=(await cookies()).get(config.SESSION_COOKIE_NAME)?.value??'';
  if(!await currentActor(token))return NextResponse.json({error:{code:'UNAUTHENTICATED',message:'Inicie sesión para consultar las capacidades disponibles.'},correlationId:cid},{status:401});
  const modules=await listProductModules();
  return NextResponse.json({data:{active:modules.filter(module=>module.status==='active').map(module=>module.key)},correlationId:cid});
}
