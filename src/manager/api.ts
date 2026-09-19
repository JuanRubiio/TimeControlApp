import type { Employee } from '@/admin/api';

type Envelope<T>={data:T;error?:{message?:string}};
export type TeamSnapshot={
  employee:Employee;
  site:{id:string;name:string};
  laborDate:string;
  imputation:{status:'without_records'|'recorded'|'with_incidents';effectiveMinutes:number;expectedMinutes:number|null;differenceMinutes:number|null};
  locationVerification:'not_recorded'|'punctual_verified';
};

async function request<T>(url:string):Promise<T>{
  const response=await fetch(url,{credentials:'same-origin'});
  const body=await response.json().catch(()=>null) as Envelope<T>|null;
  if(!response.ok||!body)throw new Error('No se pudo completar la consulta.');
  return body.data;
}

export const managerApi={team:()=>request<{team:TeamSnapshot[]}>('/api/v1/manager/team').then(value=>value.team)};
