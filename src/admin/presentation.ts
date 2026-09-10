import type { CorrectionStatus } from '@/corrections/contracts';
import type { TimeEventType } from '@/time-events/contracts';
export const eventLabel:Record<TimeEventType,string>={clock_in:'Entrada',clock_out:'Salida',break_start:'Inicio de pausa',break_end:'Fin de pausa'};
export const correctionLabel:Record<CorrectionStatus,string>={pending:'Pendiente',approved:'Aprobada',rejected:'Rechazada'};
export const minutes=(value:number)=>`${value<0?'−':''}${Math.floor(Math.abs(value)/60)} h ${String(Math.abs(value)%60).padStart(2,'0')} min`;
export const dateTime=(value:string,timeZone:string)=>new Intl.DateTimeFormat('es-ES',{dateStyle:'medium',timeStyle:'short',timeZone}).format(new Date(value));
export const dateToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid'}).format(new Date());
export const isoWeekStart=()=>{const date=new Date();const day=(date.getDay()+6)%7;date.setDate(date.getDate()-day);return date.toISOString().slice(0,10);};
