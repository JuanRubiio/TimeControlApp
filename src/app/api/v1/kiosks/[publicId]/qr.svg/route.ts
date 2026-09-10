import { NextRequest } from 'next/server';
import QRCode from 'qrcode';
import { createQrChallenge } from '@/time-events/service';

export const runtime='nodejs';
export async function GET(request:NextRequest,{params}:{params:Promise<{publicId:string}>}) {
  try { const challenge=await createQrChallenge((await params).publicId); const payload=new URL(`/kiosk?challenge=${encodeURIComponent(challenge.token)}`,request.url).toString(); const svg=await QRCode.toString(payload,{type:'svg',errorCorrectionLevel:'M',margin:2,width:320,color:{dark:'#172033',light:'#ffffffff'}}); return new Response(svg,{headers:{'content-type':'image/svg+xml','cache-control':'no-store, private','x-qr-expires-at':challenge.expiresAt}}); }
  catch { return new Response('',{status:404,headers:{'cache-control':'no-store'}}); }
}
