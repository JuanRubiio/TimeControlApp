import type { CorrectionRequest } from '@/corrections/contracts';
import type { LeaveRequest } from '@/leave-requests/contracts';

export type ManagerHoliday={siteId:string;date:string;type:'national'|'regional'|'local'};
export type ManagerHomeDecision={kind:'correction'|'leave';id:string;date:string;label:string;href:string};
export type ManagerHomeException={siteId:string;date:string;label:string};
export type ManagerAttentionItem={kind:'correction'|'leave';id:string;siteId:string;requestedAt:string;affectedDate:string;label:string;detail:string;href:string};

const leaveLabel:Partial<Record<LeaveRequest['category'],string>>={vacation:'Vacaciones aprobadas',absence:'Ausencia aprobada'};
const holidayLabel:Record<ManagerHoliday['type'],string>={national:'Festivo nacional',regional:'Festivo autonómico',local:'Festivo local'};
const requestLabel:Record<LeaveRequest['category'],string>={general_request:'Solicitud general',personal_management:'Gestión personal',availability_adjustment:'Ajuste de disponibilidad',vacation:'Vacaciones',absence:'Ausencia'};

/** Normaliza únicamente datos operativos mínimos para la bandeja del responsable. */
export function managerAttentionItems(corrections:readonly CorrectionRequest[],leaveRequests:readonly LeaveRequest[]):ManagerAttentionItem[]{
  return [
    ...corrections.filter(item=>item.status==='pending').map(item=>({kind:'correction' as const,id:item.id,siteId:item.siteId,requestedAt:item.requestedAt,affectedDate:item.laborDate,label:'Corrección pendiente',detail:`Jornada del ${item.laborDate}`,href:`/manager/corrections/${item.id}`})),
    ...leaveRequests.filter(item=>item.status==='pending').map(item=>({kind:'leave' as const,id:item.id,siteId:item.siteId,requestedAt:item.requestedAt,affectedDate:item.fromDate,label:requestLabel[item.category],detail:`Del ${item.fromDate} al ${item.toDate}`,href:'/manager/leave-requests'}))
  ].sort((left,right)=>left.requestedAt.localeCompare(right.requestedAt)||left.id.localeCompare(right.id));
}

/** Resume decisiones y excepciones sin devolver comentarios ni motivos personales. */
export function managerHomeItems(corrections:readonly CorrectionRequest[],leaveRequests:readonly LeaveRequest[],holidays:readonly ManagerHoliday[],today:string){
  const pendingCorrections=corrections.filter(item=>item.status==='pending');
  const pendingLeaves=leaveRequests.filter(item=>item.status==='pending');
  const decisions:ManagerHomeDecision[]=[
    ...pendingCorrections.map(item=>({kind:'correction' as const,id:item.id,date:item.laborDate,label:`Corrección del ${item.laborDate}`,href:`/manager/corrections/${item.id}`})),
    ...pendingLeaves.map(item=>({kind:'leave' as const,id:item.id,date:item.fromDate,label:'Solicitud pendiente',href:'/manager/leave-requests'}))
  ].sort((left,right)=>left.date.localeCompare(right.date));
  const exceptions:ManagerHomeException[]=[
    ...holidays.filter(item=>item.date>=today).map(item=>({siteId:item.siteId,date:item.date,label:holidayLabel[item.type]})),
    ...leaveRequests.filter(item=>item.status==='approved'&&item.toDate>=today&&leaveLabel[item.category]).map(item=>({siteId:item.siteId,date:item.fromDate<today?today:item.fromDate,label:leaveLabel[item.category]!}))
  ].sort((left,right)=>left.date.localeCompare(right.date));
  return {pendingCorrectionCount:pendingCorrections.length,pendingLeaveCount:pendingLeaves.length,decisions,exceptions};
}
