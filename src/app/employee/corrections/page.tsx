import { Suspense } from 'react';
import { Corrections } from '@/employee/components';
import { requirePageSession } from '@/auth/page-guard';
export default async function CorrectionsPage(){await requirePageSession('/employee/corrections');return <Suspense fallback={<main className="employee-shell">Cargando correcciones…</main>}><Corrections/></Suspense>;}
