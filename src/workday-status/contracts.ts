import type { EffectiveWorkday } from '@/time-calculation/contracts';

export type WorkdayStatusKind='not_started'|'working'|'on_break'|'ended';
export type WorkdayStatus={asOf:string;laborDate:string;effectiveTimeZone:string;status:WorkdayStatusKind;effectiveMinutes:number|null;lastConfirmedAt:string|null;nextAction:'clock_in'|'clock_out'|'break_start'|'break_end'|null};

export function projectWorkday(workday:EffectiveWorkday,asOf:string):WorkdayStatus{
  const events=workday.events; const last=events.at(-1); let effective=0; let activeAt:string|null=null;
  for(const event of events){if(event.eventType==='clock_in'||event.eventType==='break_end')activeAt=event.occurredAt;else if((event.eventType==='break_start'||event.eventType==='clock_out')&&activeAt){effective+=Math.max(0,Math.round((Date.parse(event.occurredAt)-Date.parse(activeAt))/60000));activeAt=null;}}
  const kind:WorkdayStatusKind=!last?'not_started':last.eventType==='clock_out'?'ended':last.eventType==='break_start'?'on_break':'working';
  if(kind==='working'&&activeAt)effective+=Math.max(0,Math.round((Date.parse(asOf)-Date.parse(activeAt))/60000));
  const nextAction=kind==='not_started'||kind==='ended'?'clock_in':kind==='on_break'?'break_end':'break_start';
  const hasClockIn=events.some((event)=>event.eventType==='clock_in');
  return {asOf,laborDate:workday.laborDate,effectiveTimeZone:workday.effectiveTimeZone,status:kind,effectiveMinutes:hasClockIn?effective:null,lastConfirmedAt:last?.occurredAt??null,nextAction};
}
