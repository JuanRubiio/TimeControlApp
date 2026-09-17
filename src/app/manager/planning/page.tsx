import { requirePageSession } from '@/auth/page-guard';
import { ManagerPlanning } from '@/shift-planning/manager';

export default async function ManagerPlanningPage(){await requirePageSession('/manager/planning');return <ManagerPlanning/>;}
