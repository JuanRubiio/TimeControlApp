import { requirePageSession } from '@/auth/page-guard';
import CorrectionPageClient from './page-client';
export default async function CorrectionPage({params}:{params:Promise<{id:string}>}){const {id}=await params;await requirePageSession(`/admin/corrections/${encodeURIComponent(id)}`);return <CorrectionPageClient/>;}
