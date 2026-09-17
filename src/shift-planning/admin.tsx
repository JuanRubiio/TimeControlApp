'use client';

import { FormEvent, useEffect, useState } from 'react';
import { AdminNav } from '@/admin/components';

type Template = { id: string; name: string; version: number; status: 'draft' | 'published' | 'retired'; timeZone: string; segments: { start: string; end: string }[]; expectedMinutes: number };
type Employment = { id: string; displayName: string; siteName: string; effectiveFrom: string; effectiveTo: string | null };

const timeZones = [
  { value: 'Europe/Madrid', label: 'Madrid (Europa central)' },
  { value: 'Atlantic/Canary', label: 'Islas Canarias (Europa occidental)' },
  { value: 'Europe/Lisbon', label: 'Lisboa (Europa occidental)' },
  { value: 'Europe/London', label: 'Londres (Europa occidental)' },
] as const;

const statusLabel = { draft: 'Borrador', published: 'Publicada', retired: 'Retirada' };
const duration = (minutes: number) => `${Math.floor(minutes / 60)} h${minutes % 60 ? ` ${minutes % 60} min` : ''}`;
const employmentLabel = (employment: Employment) => `${employment.displayName} · ${employment.siteName} · vigente desde ${employment.effectiveFrom}`;

async function request<T>(url: string, init?: RequestInit) {
  const response = await fetch(url, { credentials: 'same-origin', ...init });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error?.message ?? 'No se pudo completar la operación.');
  return body.data as T;
}

export function ShiftPlanningAdmin() {
  const [status, setStatus] = useState('disabled');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [employments, setEmployments] = useState<Employment[]>([]);
  const [notice, setNotice] = useState('');
  const [versionSource, setVersionSource] = useState<Template>();

  const load = () => Promise.all([
    request<{ status: string }>('/api/v1/shift-planning/module'),
    request<Template[]>('/api/v1/shift-planning/templates'),
    request<Employment[]>('/api/v1/employments'),
  ]).then(([module, items, relations]) => {
    setStatus(module.status);
    setTemplates(items);
    setEmployments(relations);
  }).catch((error) => setNotice(error instanceof Error ? error.message : 'No se pudo cargar la planificación.'));

  useEffect(() => { void load(); }, []);

  const activate = async () => {
    try {
      await request('/api/v1/shift-planning/module', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ status: 'active' }) });
      setNotice('Módulo activado para este entorno sintético.');
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo activar el módulo.');
    }
  };

  const publishTemplate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const payload = { name: String(form.get('name')), timeZone: String(form.get('timeZone')), segments: [{ start: String(form.get('start')), end: String(form.get('end')) }] };
    try {
      await request(versionSource ? `/api/v1/shift-planning/templates/${versionSource.id}/version` : '/api/v1/shift-planning/templates', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
      setNotice(versionSource ? 'Nueva versión publicada. Las asignaciones existentes no han cambiado.' : 'Plantilla publicada.');
      setVersionSource(undefined);
      formElement.reset();
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo publicar la plantilla.');
    }
  };

  const retireTemplate = async (template: Template) => {
    try {
      await request(`/api/v1/shift-planning/templates/${template.id}/retire`, { method: 'POST' });
      setNotice(`Plantilla «${template.name}» retirada del uso futuro. Su historial se conserva.`);
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo retirar la plantilla.');
    }
  };

  const publishAssignment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      await request('/api/v1/shift-planning/assignments', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ employmentId: String(form.get('employmentId')), templateId: String(form.get('templateId')), effectiveFrom: String(form.get('effectiveFrom')), reasonCode: 'initial_plan' }) });
      setNotice('Jornada futura publicada.');
      formElement.reset();
      await load();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No se pudo publicar la jornada.');
    }
  };

  return <main className="admin-shell"><AdminNav /><header><p className="eyebrow">PLANIFICACIÓN FUTURA</p><h1>Jornadas previstas</h1><p className="subtle">Referencia operativa futura: no modifica fichajes, cálculos ni derechos laborales.</p></header>{notice && <p className="status-notice status-notice--info" role="status">{notice}</p>}<section className="admin-section"><h2>Estado del módulo</h2><p>Estado actual: <strong>{status}</strong>.</p>{status !== 'active' && <button onClick={() => void activate()}>Activar para demo sintética</button>}</section><section className="admin-section"><div className="section-heading"><div><h2>{versionSource ? `Nueva versión de «${versionSource.name}»` : 'Publicar plantilla'}</h2><p className="subtle">La duración prevista se calcula desde los tramos y queda congelada al publicar una asignación.</p></div>{versionSource && <button className="secondary" type="button" onClick={() => setVersionSource(undefined)}>Cancelar versión</button>}</div><form key={versionSource?.id ?? 'new'} className="employee-form" onSubmit={(event) => void publishTemplate(event)}><label>Nombre<input name="name" required maxLength={160} defaultValue={versionSource?.name} readOnly={!!versionSource} /></label><label>Zona horaria<select name="timeZone" defaultValue={versionSource?.timeZone ?? 'Europe/Madrid'} required>{timeZones.map((timeZone) => <option key={timeZone.value} value={timeZone.value}>{timeZone.label}</option>)}</select></label><label>Inicio<input name="start" type="time" defaultValue={versionSource?.segments[0]?.start ?? '09:00'} required /></label><label>Fin<input name="end" type="time" defaultValue={versionSource?.segments[0]?.end ?? '17:00'} required /></label><button>{versionSource ? 'Publicar nueva versión' : 'Publicar plantilla'}</button></form>{templates.length > 0 && <section className="admin-section" aria-labelledby="template-list-title"><h3 id="template-list-title">Plantillas disponibles</h3><ul className="admin-list">{templates.map((template) => <li key={template.id}><span><strong>{template.name} · v{template.version}</strong><small>{duration(template.expectedMinutes)} · {template.timeZone} · {statusLabel[template.status]}</small></span>{template.status === 'retired' ? <small>Conservada sólo como historial</small> : <span className="admin-decision"><button className="secondary" type="button" onClick={() => setVersionSource(template)}>Nueva versión</button><button className="secondary" type="button" onClick={() => void retireTemplate(template)}>Retirar</button></span>}</li>)}</ul></section>}</section><section className="admin-section"><h2>Publicar jornada futura</h2><form className="employee-form" onSubmit={(event) => void publishAssignment(event)}><label>Relación laboral<select name="employmentId" required><option value="">Seleccione una relación</option>{employments.map((employment) => <option key={employment.id} value={employment.id}>{employmentLabel(employment)}</option>)}</select></label><label>Plantilla<select name="templateId" required><option value="">Seleccione una plantilla</option>{templates.filter((template) => template.status === 'published').map((template) => <option key={template.id} value={template.id}>{template.name} · v{template.version} · {duration(template.expectedMinutes)}</option>)}</select></label><label>Vigente desde<input name="effectiveFrom" type="date" required /></label><button>Publicar jornada</button></form></section></main>;
}
