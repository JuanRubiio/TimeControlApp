import { Dashboard } from '@/employee/components';
import { requirePageSession } from '@/auth/page-guard';
export default async function EmployeePage(){await requirePageSession('/employee');return <Dashboard/>;}
