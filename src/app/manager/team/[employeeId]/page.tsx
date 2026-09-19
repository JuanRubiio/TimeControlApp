import { requirePageSession } from '@/auth/page-guard';
import { ManagerPersonDetail } from '@/manager/person-detail';
export default async function ManagerPersonPage({params}:{params:Promise<{employeeId:string}>}){const {employeeId}=await params;await requirePageSession(`/manager/team/${encodeURIComponent(employeeId)}`);return <ManagerPersonDetail employeeId={employeeId}/>;}
