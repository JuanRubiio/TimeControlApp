'use client';

import { FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { safeReturnTo } from './return-to';

type LoginResponse = { data?: { mfaRequired?: boolean; enrollmentRequired?: boolean; destination?: string }; error?: { message?: string } };

async function api(url:string, body?:unknown) {
  const response=await fetch(url,{method:'POST',credentials:'same-origin',headers:body?{'content-type':'application/json'}:undefined,body:body?JSON.stringify(body):undefined});
  const payload=await response.json().catch(()=>null) as LoginResponse;
  if(!response.ok) throw new Error(payload?.error?.message??'No se pudo completar la operación.');
  return payload.data;
}

export function LogoutButton(){const router=useRouter(); const [busy,setBusy]=useState(false); return <button className="link-button" onClick={async()=>{setBusy(true);try{await api('/api/v1/auth/logout');router.replace('/login');router.refresh();}finally{setBusy(false);}}} disabled={busy}>{busy?'Cerrando sesión…':'Cerrar sesión'}</button>;}

export default function Login(){
  const router=useRouter(); const params=useSearchParams(); const returnTo=safeReturnTo(params.get('returnTo')); const [roleDestination,setRoleDestination]=useState('/employee'); const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [code,setCode]=useState(''); const [mfa,setMfa]=useState(false); const [enrollment,setEnrollment]=useState(false); const [uri,setUri]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false);
  const complete=(serverDestination?:string)=>{router.replace(returnTo??safeReturnTo(serverDestination)??roleDestination);router.refresh();};
  const submit=async(event:FormEvent)=>{event.preventDefault();setError('');setBusy(true);try{const result=await api('/api/v1/auth/login',{email,password});const destination=safeReturnTo((result as {destination?:string})?.destination)??'/employee';setRoleDestination(destination);if(result?.mfaRequired){setMfa(true);setEnrollment(!!result.enrollmentRequired);if(result.enrollmentRequired){const setup=await api('/api/v1/auth/mfa/setup');setUri((setup as {otpauthUri?:string})?.otpauthUri??'');}}else{complete(destination);}}catch(value){setError(value instanceof Error?value.message:'No se pudo iniciar sesión.');}finally{setBusy(false);}};
  const verify=async(event:FormEvent)=>{event.preventDefault();setError('');setBusy(true);try{const result=await api('/api/v1/auth/mfa/verify',{code});complete((result as {destination?:string})?.destination);}catch(value){setError(value instanceof Error?value.message:'No se pudo verificar el código.');}finally{setBusy(false);}};
  return <main className="login-shell"><section className="login-card"><p className="eyebrow">CONTROL HORARIO</p><h1>{mfa?'Verificación en dos pasos':'Acceder'}</h1>{error&&<p className="employee-notice error" role="alert">{error}</p>}{!mfa?<form className="employee-form" onSubmit={submit}><label>Correo<input type="email" autoComplete="username" value={email} onChange={event=>setEmail(event.target.value)} required/></label><label>Contraseña<input type="password" autoComplete="current-password" minLength={12} value={password} onChange={event=>setPassword(event.target.value)} required/></label><button disabled={busy}>{busy?'Accediendo…':'Continuar'}</button></form>:<form className="employee-form" onSubmit={verify}>{enrollment&&<><p className="informative">Añade esta cuenta a tu aplicación autenticadora antes de continuar. No compartas este código de configuración.</p>{uri&&<a className="otpauth-link" href={uri}>Abrir configuración en la aplicación autenticadora</a>}</>}<label>Código de seis dígitos<input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={event=>setCode(event.target.value.replace(/\D/g,''))} required/></label><button disabled={busy}>{busy?'Verificando…':'Verificar y acceder'}</button></form>}<p className="subtle">Accede con la cuenta facilitada por tu empresa. Si necesitas ayuda, contacta con la persona administradora.</p></section></main>;
}
