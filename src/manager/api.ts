import type { Employee } from '@/admin/api';
import type { CorrectionRequest } from '@/corrections/contracts';
import type { LeaveRequest } from '@/leave-requests/contracts';

type Envelope<T>={data:T;error?:{message?:string}};
export type TeamSnapshot={
  employee:Employee;
  site:{id:string;name:string};
  laborDate:string;
  imputation:{status:'without_records'|'recorded'|'with_incidents';effectiveMinutes:number;expectedMinutes:number|null;differenceMinutes:number|null};
  locationVerification:'not_recorded'|'punctual_verified';
  pending:{corrections:number;leaveRequests:number};
};
export type TeamPersonDetail={employee:Employee;site:{id:string;name:string};workdays:{laborDate:string;effectiveMinutes:number;expectedMinutes:number;incidents:number}[];corrections:{id:string;laborDate:string;status:'pending'|'approved'|'rejected'}[];leaveRequests:{id:string;fromDate:string;toDate:string;category:string;status:'pending'|'approved'|'rejected'|'cancelled'}[]};

async function request<T>(url:string):Promise<T>{
  const response=await fetch(url,{credentials:'same-origin'});
  const body=await response.json().catch(()=>null) as Envelope<T>|null;
  if(!response.ok||!body)throw new Error('No se pudo completar la consulta.');
  return body.data;
}

export const managerApi={team:()=>request<{team:TeamSnapshot[]}>('/api/v1/manager/team').then(value=>value.team),person:(employeeId:string)=>request<{person:TeamPersonDetail}>(`/api/v1/manager/team/${encodeURIComponent(employeeId)}`).then(value=>value.person),attention:()=>Promise.all([request<{corrections:CorrectionRequest[]}>('/api/v1/corrections'),request<{leaveRequests:LeaveRequest[]}>('/api/v1/leave-requests')]).then(([corrections,leaveRequests])=>({corrections:corrections.corrections,leaveRequests:leaveRequests.leaveRequests}))};
