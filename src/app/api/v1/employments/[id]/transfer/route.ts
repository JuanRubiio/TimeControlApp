import { NextRequest } from 'next/server';
import { employmentTransferInput } from '@/company-people/schemas';
import * as service from '@/company-people/service';
import { authenticated, data, hasEnvironmentScope, invalid, missing } from '@/company-people/http';
import { error } from '@/auth/http';

type Context={params:Promise<{id:string}>};
export async function POST(request:NextRequest,{params}:Context){
 const access=await authenticated(request,'employment.write');
 if('response'in access)return access.response;
 if(!hasEnvironmentScope(access.actor))return error('FORBIDDEN','Sólo administración puede trasladar personas entre centros.',403,access.cid);
 const parsed=employmentTransferInput.safeParse(await request.json().catch(()=>null));
 if(!parsed.success)return invalid(access.cid);
 try{
  const result=await service.transferEmployment((await params).id,parsed.data,access);
  return result?data(result,access.cid,201):missing(access.cid);
 }catch{return data({code:'CONFLICT'},access.cid,409);}
}
