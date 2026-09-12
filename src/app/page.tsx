import { requirePageSession } from '@/auth/page-guard';
import { redirect } from 'next/navigation';

export default async function Home(){
  await requirePageSession('/employee');
  redirect('/employee');
}
