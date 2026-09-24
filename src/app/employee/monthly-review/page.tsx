import { redirect } from 'next/navigation';
import { requirePageSession } from '@/auth/page-guard';
import { productModuleStatus } from '@/modules/service';
import { MonthlyReviewPage } from '@/monthly-review/components';
export default async function Page(){await requirePageSession('/employee/monthly-review');if(await productModuleStatus('informative_hour_balance')!=='active')redirect('/employee');return <MonthlyReviewPage/>;}
