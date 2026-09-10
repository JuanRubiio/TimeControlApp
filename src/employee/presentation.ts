import type { TimeEvent, TimeEventType } from '@/time-events/contracts';
import type { PersistedDailyCalculation } from '@/time-calculation/contracts';

export const eventLabels:Record<TimeEventType,string>={clock_in:'Entrada',clock_out:'Salida',break_start:'Inicio de pausa',break_end:'Fin de pausa'};
export const actionLabels:Record<TimeEventType,string>={clock_in:'Registrar entrada',clock_out:'Registrar salida',break_start:'Iniciar pausa',break_end:'Finalizar pausa'};
export function availableActions(last?:TimeEvent):TimeEventType[]{if(!last||last.eventType==='clock_out')return ['clock_in'];if(last.eventType==='break_start')return ['break_end'];return ['break_start','clock_out'];}
export function dayStatus(last?:TimeEvent, calculation?:PersistedDailyCalculation|null){if(calculation?.incidents.length)return 'incidencia';if(!last||last.eventType==='clock_out')return 'no iniciada';if(last.eventType==='break_start')return 'en pausa';if(calculation?.incidents.some(i=>i.code==='OPEN_WORKDAY'||i.code==='OPEN_BREAK'))return 'pendiente de completar';return 'trabajando';}
export function minutes(value:number){const sign=value<0?'−':'';const absolute=Math.abs(value);return `${sign}${Math.floor(absolute/60)} h ${String(absolute%60).padStart(2,'0')} min`;}
export function dateTime(value:string,timeZone='Europe/Madrid'){return new Intl.DateTimeFormat('es-ES',{dateStyle:'medium',timeStyle:'short',timeZone}).format(new Date(value));}
export function errorMessage(value:unknown){return value instanceof Error?value.message:'No se pudo completar la operación. Comprueba tu conexión e inténtalo de nuevo.';}
