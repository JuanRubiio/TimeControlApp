import { Suspense } from 'react';
import { Corrections } from '@/employee/components';
export default function CorrectionsPage(){return <Suspense fallback={<main className="employee-shell">Cargando correcciones…</main>}><Corrections/></Suspense>;}
