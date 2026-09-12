import { History } from '@/employee/components';
import { requirePageSession } from '@/auth/page-guard';
export default async function HistoryPage(){await requirePageSession('/employee/history');return <History/>;}
