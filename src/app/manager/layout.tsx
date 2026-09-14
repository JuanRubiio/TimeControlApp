import { requireWorkspaceRole } from '@/auth/page-guard';

export default async function ManagerLayout({children}:{children:React.ReactNode}) {
  await requireWorkspaceRole('/manager',['manager']);
  return children;
}
