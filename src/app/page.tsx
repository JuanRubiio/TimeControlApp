import { requirePageSession } from '@/auth/page-guard';
import { defaultDestination } from '@/auth/return-to';
import { redirect } from 'next/navigation';

export default async function Home(){
  const actor = await requirePageSession('/');
  redirect(defaultDestination(actor));
}
