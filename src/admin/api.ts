import type { CorrectionRequest } from '@/corrections/contracts';
type Envelope<T>={data:T;error?:{message?:string};correlationId?:string};
async function request<T>(url:string,init?:RequestInit):Promise<T>{const response=await fetch(url,{credentials:'same-origin',...init});const body=await response.json().catch(()=>null) as Envelope<T>;if(!response.ok)throw new Error(body?.error?.message??'No se pudo completar la consulta.');return body.data;}
export type Site={id:string;name:string;timeZone:string}; export type Employee={id:string;displayName:string};
export const adminApi={
  sites:()=>request<Site[]>('/api/v1/sites'), employees:()=>request<Employee[]>('/api/v1/employees'),
  corrections:()=>request<{corrections:CorrectionRequest[]}>('/api/v1/corrections').then((v)=>v.corrections),
  workdays:(filters:{from:string;to:string;employeeId?:string;siteId?:string;incident?:string;detail?:boolean})=>{const params=new URLSearchParams({from:filters.from,to:filters.to,incident:filters.incident??'all'});if(filters.employeeId)params.set('employeeId',filters.employeeId);if(filters.siteId)params.set('siteId',filters.siteId);if(filters.detail)params.set('detail','true');return request<{workdays:any[]}>(`/api/v1/admin/workdays?${params}`).then((v)=>v.workdays);},
  events:(employeeId:string)=>request<{events:any[]}>('/api/v1/time-events?employeeId='+encodeURIComponent(employeeId)).then((v)=>v.events??[]),
  decide:(id:string,input:{decision:'approved'|'rejected';reason?:string})=>request<{correction:CorrectionRequest}>(`/api/v1/corrections/${id}/decision`,{method:'POST',headers:{'content-type':'application/json','idempotency-key':crypto.randomUUID()},body:JSON.stringify(input)}).then((v)=>v.correction)
};
