import { requirePageSession } from '@/auth/page-guard';
import { ShiftPlanningAdmin } from '@/shift-planning/admin';
import { moduleStatus } from '@/shift-planning/service';
import { redirect } from 'next/navigation';
export default async function PlanningPage(){await requirePageSession('/admin/planning');if(await moduleStatus()!=='active')redirect('/admin/configuration?module=shift_planning');return <ShiftPlanningAdmin/>;}
