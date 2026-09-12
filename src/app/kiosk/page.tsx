import KioskClock from '@/time-events/kiosk-ui';
import { redirect } from 'next/navigation';

const publicKioskId = (value:string|undefined) => value && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value) ? value : null;

export default async function KioskPage({searchParams}:{searchParams:Promise<{publicKioskId?:string}>}){
  const id=publicKioskId((await searchParams).publicKioskId);
  if(!id) redirect('/login');
  return <KioskClock publicKioskId={id}/>;
}
