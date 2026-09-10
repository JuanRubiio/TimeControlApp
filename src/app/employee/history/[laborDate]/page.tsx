'use client';
import { useParams } from 'next/navigation';
import { DayDetail } from '@/employee/components';
export default function DetailPage(){const params=useParams<{laborDate:string}>();return <DayDetail laborDate={params.laborDate}/>;}
