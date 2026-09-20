import { requirePageSession } from '@/auth/page-guard';
import { ManagerPlanning } from '@/shift-planning/manager';
import { moduleStatus } from '@/shift-planning/service';
import { redirect } from 'next/navigation';

export default async function ManagerPlanningPage(){await requirePageSession('/manager/planning');if(await moduleStatus()!=='active')redirect('/manager');return <ManagerPlanning/>;}
