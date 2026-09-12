'use client';
import { useParams } from 'next/navigation';
import { CorrectionDetail } from '@/admin/components';

export default function CorrectionPageClient(){const params=useParams<{id:string}>();return <CorrectionDetail id={params.id}/>;}
