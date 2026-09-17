import { assertAuthorized,type ScopedActor } from '@/permissions/authorizer';
import { db } from '@/shared/db';
import { employeeForUser } from '@/time-events/service';
import { currentCalculation,publishedWorkdayForEmployee } from '@/time-calculation/service';
import type { PublishedWorkday } from '@/time-calculation/contracts';
import { ownWorkdayStatus } from '@/workday-status/service';
import { addDays,homeDay,weekStart,type EmployeeHome } from './contracts';

type Holiday={date:string;type:'national'|'regional'|'local'};
type Leave={fromDate:string;toDate:string;category:'vacation'|'absence'};

async function ownExceptions(employeeId:string,from:string,to:string){
  const [holidayRows,leaveRows]=await Promise.all([
    db.query<Holiday>(`SELECT DISTINCT h.holiday_date::text AS date,h.holiday_type AS type FROM planning_site_holidays h JOIN employments em ON em.site_id=h.site_id WHERE em.employee_id=$1 AND em.effective_from<=h.holiday_date AND (em.effective_to IS NULL OR em.effective_to>h.holiday_date) AND h.holiday_date BETWEEN $2::date AND $3::date`,[employeeId,from,to]),
    db.query<Leave>(`SELECT from_date::text AS "fromDate",to_date::text AS "toDate",category FROM leave_requests WHERE employee_id=$1 AND status='approved' AND category IN ('vacation','absence') AND from_date<=$3::date AND to_date>=$2::date`,[employeeId,from,to])
  ]);
  return {holidays:holidayRows.rows,leaves:leaveRows.rows};
}

/** Consulta compuesta, sólo propia y sin parámetros de ámbito expuestos al cliente. */
export async function ownEmployeeHome(actor:ScopedActor):Promise<EmployeeHome>{
  assertAuthorized(actor,'time-event.read:self');
  const employeeId=await employeeForUser(actor.id);if(!employeeId)throw new Error('EMPLOYEE_HOME_NOT_FOUND');
  const now=(await db.query<{asOf:Date}>('SELECT clock_timestamp() AS "asOf"')).rows[0].asOf.toISOString();
  const current=await publishedWorkdayForEmployee(employeeId,now);if(!current)throw new Error('EMPLOYEE_HOME_NOT_FOUND');
  const today=current.laborDate;const weekDates=Array.from({length:7},(_,index)=>addDays(weekStart(today),index));const calendarDates=Array.from({length:30},(_,index)=>addDays(today,index));
  const dates=[...new Set([...weekDates,...calendarDates])];const from=dates[0];const to=dates.at(-1)!;
  const [{holidays,leaves},workdays,calculations,projection]=await Promise.all([
    ownExceptions(employeeId,from,to),
    Promise.all(dates.map(async date=>[date,await publishedWorkdayForEmployee(employeeId,`${date}T12:00:00.000Z`)] as const)),
    Promise.all(weekDates.map(async date=>[date,await currentCalculation(employeeId,date)] as const)),
    ownWorkdayStatus(actor)
  ]);
  const scheduleByDate=new Map<string,PublishedWorkday|null>(workdays);const calculationByDate=new Map(calculations);
  const day=(date:string)=>homeDay(date,scheduleByDate.get(date)??null,calculationByDate.get(date)??null,holidays,leaves);
  const liveDay=(date:string)=>{const value=day(date);return date===projection.laborDate&&projection.effectiveMinutes!==null?{...value,effectiveMinutes:projection.effectiveMinutes}:value;};
  const calendar=calendarDates.map(liveDay);const week=weekDates.map(liveDay);
  return {today,week,calendar,upcoming:calendar.filter(value=>value.date>today&&['holiday','vacation','absence','rest'].includes(value.kind)).slice(0,5)};
}
