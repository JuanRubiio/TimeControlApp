import { Dashboard } from '@/employee/components';
import { requirePageSession } from '@/auth/page-guard';
import { defaultDestination } from '@/auth/return-to';
import { redirect } from 'next/navigation';
export default async function EmployeePage(){const actor=await requirePageSession('/employee');if(!actor.roles.includes('employee'))redirect(defaultDestination(actor));return <Dashboard/>;}
