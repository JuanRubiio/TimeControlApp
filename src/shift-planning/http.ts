import { NextRequest, NextResponse } from 'next/server';
import { authenticated, data, invalid, missing } from '@/company-people/http';
import { moduleStatus } from './service';

export async function planningActor(request:NextRequest, permission:'shift-planning.read'|'shift-planning.write') { return authenticated(request,permission); }
export function planningFailure(value:unknown,cid:string){const code=value instanceof Error?value.message:'';if(code==='PLANNING_MODULE_INACTIVE')return invalid(cid);if(code==='PLANNING_REFERENCE_NOT_FOUND')return missing(cid);if((value as {code?:string}).code==='23P01')return NextResponse.json({error:{code:'CONFLICT',message:'La publicación se solapa con otra asignación futura.'},correlationId:cid},{status:409});if((value as {code?:string}).code==='23505')return NextResponse.json({error:{code:'CONFLICT',message:'Ya existe una plantilla con ese nombre. Cree una nueva versión desde la plantilla existente.'},correlationId:cid},{status:409});throw value;}
export async function moduleRead(request:NextRequest){const auth=await planningActor(request,'shift-planning.read');if('response'in auth)return auth.response;return data({status:await moduleStatus()},auth.cid);}
