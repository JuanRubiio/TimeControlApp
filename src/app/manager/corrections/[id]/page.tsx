import { ManagerCorrectionReview } from '@/manager/correction-review'; import { requirePageSession } from '@/auth/page-guard';
export default async function ManagerCorrectionPage({params}:{params:Promise<{id:string}>}){const {id}=await params;await requirePageSession(`/manager/corrections/${encodeURIComponent(id)}`);return <ManagerCorrectionReview id={id}/>;}
