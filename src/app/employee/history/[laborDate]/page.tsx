import { requirePageSession } from '@/auth/page-guard';
import DetailPageClient from './page-client';
export default async function DetailPage({params}:{params:Promise<{laborDate:string}>}){const {laborDate}=await params;await requirePageSession(`/employee/history/${encodeURIComponent(laborDate)}`);return <DetailPageClient/>;}
