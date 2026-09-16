import { requirePageSession } from '@/auth/page-guard';
import { ShiftPlanningAdmin } from '@/shift-planning/admin';
export default async function PlanningPage(){await requirePageSession('/admin/planning');return <ShiftPlanningAdmin/>;}
