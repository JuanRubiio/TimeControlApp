'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { LogoutButton } from '@/auth/ui';
import { StatusBadge, StatusNotice } from '@/ui/feedback';
import { adminApi, type Employee, type Site } from '@/admin/api';
import type { CorrectionRequest } from '@/corrections/contracts';

function ManagerNav(){return <nav className="admin-nav" aria-label="Espacio de responsable"><Link href="/manager">Mi centro</Link><a href="#equipo">Equipo</a><a href="#correcciones">Correcciones</a><LogoutButton/></nav>}
const kind=(status:CorrectionRequest['status'])=>status==='approved'?'success':status==='rejected'?'error':'warning';

export function ManagerDashboard(){
  const [state,setState]=useState<{sites:Site[];employees:Employee[];corrections:CorrectionRequest[];error?:string}>({sites:[],employees:[],corrections:[]});
  useEffect(()=>{Promise.all([adminApi.sites(),adminApi.employees(),adminApi.corrections()]).then(([sites,employees,corrections])=>setState({sites,employees,corrections})).catch((error)=>setState({sites:[],employees:[],corrections:[],error:error instanceof Error?error.message:'No se pudo cargar el espacio de responsable.'}));},[]);
  const pending=useMemo(()=>state.corrections.filter((item)=>item.status==='pending'),[state.corrections]);
  return <main className="admin-shell"><ManagerNav/><header><p className="eyebrow">RESPONSABLE DE CENTRO</p><h1>Seguimiento de mi equipo</h1><p className="subtle">Sólo se muestra el ámbito de centro que tienes autorizado. La configuración global corresponde exclusivamente a Administración.</p></header>{state.error&&<StatusNotice kind="error">{state.error}</StatusNotice>}<section className="admin-cards" aria-label="Resumen del centro"><article><strong>{state.employees.length}</strong><span>Personas de mi centro</span></article><article><strong>{state.sites.length}</strong><span>Centros autorizados</span></article><article><strong>{pending.length}</strong><span>Correcciones pendientes</span></article></section><section id="equipo" className="admin-section"><h2>Equipo autorizado</h2>{state.employees.length?<ul className="admin-list">{state.employees.map((employee)=><li key={employee.id}><span><strong>{employee.displayName}</strong><small>Persona dentro de tu ámbito autorizado</small></span></li>)}</ul>:<p className="subtle">No hay personas disponibles en tu ámbito.</p>}</section><section id="correcciones" className="admin-section"><h2>Correcciones</h2>{pending.length?<ul className="admin-list">{pending.map((item)=><li key={item.id}><span><StatusBadge kind={kind(item.status)}>Pendiente</StatusBadge><strong>{item.laborDate}</strong><small>{item.reason}</small></span></li>)}</ul>:<p className="subtle">No hay correcciones pendientes en tu ámbito.</p>}</section></main>;
}
