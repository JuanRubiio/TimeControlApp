import type { PersistedDailyCalculation, PublishedWorkday } from '@/time-calculation/contracts';

export type EmployeeHomeDayKind='schedule'|'rest'|'holiday'|'vacation'|'absence'|'no_schedule';
export type EmployeeHomeDay={date:string;kind:EmployeeHomeDayKind;label:string;expectedMinutes:number|null;effectiveMinutes:number|null};
export type EmployeeHome={today:string;week:EmployeeHomeDay[];calendar:EmployeeHomeDay[];upcoming:EmployeeHomeDay[]};
export type EmployeeHomeComparison='met_or_exceeded'|'below'|null;

export const addDays=(date:string,offset:number)=>{const value=new Date(`${date}T12:00:00.000Z`);value.setUTCDate(value.getUTCDate()+offset);return value.toISOString().slice(0,10);};
export const weekStart=(date:string)=>addDays(date,-((new Date(`${date}T12:00:00.000Z`).getUTCDay()+6)%7));

/** Una comparación sólo se considera cerrada una vez que la fecha laboral ha pasado. */
export function homeComparison(day:EmployeeHomeDay,today:string):EmployeeHomeComparison{
  if(day.kind!=='schedule'||day.date>=today||day.effectiveMinutes===null||day.expectedMinutes===null)return null;
  return day.effectiveMinutes>=day.expectedMinutes?'met_or_exceeded':'below';
}

type Holiday={date:string;type:'national'|'regional'|'local'};
type Leave={fromDate:string;toDate:string;category:'vacation'|'absence'};
const holidayLabel:Record<Holiday['type'],string>={national:'Festivo nacional',regional:'Festivo autonómico',local:'Festivo local'};

/** Orden de presentación acordado para la vista propia. No calcula ni altera ninguna jornada. */
export function homeDay(date:string,workday:PublishedWorkday|null,calculation:PersistedDailyCalculation|null,holidays:readonly Holiday[],leaves:readonly Leave[]):EmployeeHomeDay{
  const leave=leaves.find(value=>value.fromDate<=date&&value.toDate>=date);
  const expected=workday?.schedule?.expectedMinutes??null;
  const effective=calculation?.effectiveMinutes??null;
  if(leave)return {date,kind:leave.category,label:leave.category==='vacation'?'Vacaciones':'Ausencia',expectedMinutes:expected,effectiveMinutes:effective};
  const holiday=holidays.find(value=>value.date===date);
  if(holiday)return {date,kind:'holiday',label:holidayLabel[holiday.type],expectedMinutes:expected,effectiveMinutes:effective};
  const schedule=workday?.schedule;
  if(!schedule)return {date,kind:'no_schedule',label:'Sin jornada publicada',expectedMinutes:null,effectiveMinutes:effective};
  if(schedule.calendar?.holidays.includes(date))return {date,kind:'holiday',label:'Festivo publicado',expectedMinutes:expected,effectiveMinutes:effective};
  const weekday=new Date(`${date}T12:00:00.000Z`).getUTCDay();
  if(schedule.calendar&&!schedule.calendar.workingDays.includes(weekday))return {date,kind:'rest',label:'Descanso publicado',expectedMinutes:expected,effectiveMinutes:effective};
  const segments=schedule.shift?.segments.map(segment=>`${segment.start}–${segment.end}`).join(' · ');
  return {date,kind:'schedule',label:segments??'Jornada publicada',expectedMinutes:expected,effectiveMinutes:effective};
}
