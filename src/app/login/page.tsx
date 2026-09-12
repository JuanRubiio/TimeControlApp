import Login from '@/auth/ui';
import { Suspense } from 'react';
export default function LoginPage(){return <Suspense fallback={<main className="login-shell">Cargando acceso…</main>}><Login/></Suspense>;}
