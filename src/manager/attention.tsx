'use client';

import Link from 'next/link';
import { useEffect,useMemo,useState } from 'react';
import { adminApi,type Site } from '@/admin/api';
import { ManagerNav } from './components';
import { managerApi } from './api';
import { managerAttentionItems,type ManagerAttentionItem } from './home';
import { LoadingBlock,StatusBadge } from '@/ui/feedback';
import { ReadRecoveryNotice } from '@/ui/read-recovery-notice';

type AttentionType='all'|'correction'|'leave';

function requestedAt(value:string){return new Intl.DateTimeFormat('es-ES',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Madrid'}).format(new Date(value));}

export function ManagerAttention({initialType='all'}:{initialType?:AttentionType}){
  const [items,setItems]=useState<ManagerAttentionItem[]>([]);const [sites,setSites]=useState<Site[]>([]);const [type,setType]=useState<AttentionType>(initialType);const [siteId,setSiteId]=useState('');const [loading,setLoading]=useState(true);const [failure,setFailure]=useState<unknown>();
  const load=()=>{setLoading(true);setFailure(undefined);Promise.all([managerApi.attention(),adminApi.sites()]).then(([attention,authorizedSites])=>{setItems(managerAttentionItems(attention.corrections,attention.leaveRequests));setSites(authorizedSites);}).catch(setFailure).finally(()=>setLoading(false));};
  useEffect(()=>{void load();},[]);
  const visible=useMemo(()=>items.filter(item=>(type==='all'||item.kind===type)&&(!siteId||item.siteId===siteId)),[items,type,siteId]);const siteNames=new Map(sites.map(site=>[site.id,site.name]));
  return <main className="admin-shell"><ManagerNav/><header><p className="eyebrow">RESPONSABLE DE CENTRO</p><h1>Atención pendiente</h1><p className="subtle">Elementos pendientes de tus centros, ordenados por fecha de solicitud. El orden es cronológico, no una prioridad automática.</p></header>{failure?<ReadRecoveryNotice onRetry={load}/>:loading?<LoadingBlock>Consultando la atención pendiente…</LoadingBlock>:<section className="admin-section manager-attention"><div className="section-heading"><div><h2>Bandeja</h2><p className="subtle">La bandeja no toma decisiones ni muestra motivos o comentarios personales.</p></div><button className="secondary" onClick={load}>Actualizar</button></div><div className="manager-attention__filters" aria-label="Filtros de atención"><label>Tipo<select value={type} onChange={event=>setType(event.target.value as AttentionType)}><option value="all">Todo</option><option value="correction">Correcciones</option><option value="leave">Solicitudes</option></select></label>{sites.length>1&&<label>Centro<select value={siteId} onChange={event=>setSiteId(event.target.value)}><option value="">Todos los autorizados</option>{sites.map(site=><option key={site.id} value={site.id}>{site.name}</option>)}</select></label>}</div>{visible.length?<ul className="manager-attention__list">{visible.map(item=><li key={`${item.kind}-${item.id}`}><div><StatusBadge kind="warning">Pendiente</StatusBadge><strong>{item.label}</strong><small>{item.detail}</small><small>Solicitada {requestedAt(item.requestedAt)}{sites.length>1&&` · ${siteNames.get(item.siteId)??'Centro autorizado'}`}</small></div><Link className="ui-action ui-action--secondary" href={item.href}>Revisar</Link></li>)}</ul>:<p className="subtle">No hay elementos pendientes que coincidan con los filtros.</p>}</section>}</main>;
}
