import { redirect } from 'next/navigation';
import { requireWorkspaceRole } from '@/auth/page-guard';

export default async function AdminLayout({children}:{children:React.ReactNode}) {
  await requireWorkspaceRole('/admin',['admin','auditor']);
  return children;
}
