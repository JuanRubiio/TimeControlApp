import { ALGORITHM_VERSION, type CalculationEvent, type CalculationIncident, type CalculationInput, type DailyCalculation } from './contracts';

const minutes=(from:Date,to:Date)=>Math.max(0,Math.round((to.getTime()-from.getTime())/60000));
function expected(rule:CalculationInput['rule'], laborDate:string) {
  const calendar=rule.calendar;
  if (!calendar) return rule.expectedMinutes;
  const day=new Date(`${laborDate}T12:00:00.000Z`).getUTCDay() || 7;
  return calendar.holidays.includes(laborDate) || !calendar.workingDays.includes(day) ? 0 : rule.expectedMinutes;
}
function incident(items:CalculationIncident[],code:CalculationIncident['code'],event:CalculationEvent|undefined,message:string){items.push({code,eventId:event?.id,message});}

/** Cálculo puro: sólo mide intervalos cerrados respaldados por eventos UTC. */
export function calculateDaily(input:CalculationInput):DailyCalculation {
  const events=[...input.events].sort((a,b)=>a.occurredAt.localeCompare(b.occurredAt)||a.id.localeCompare(b.id));
  let workStart:Date|undefined, presenceStart:Date|undefined, breakStart:Date|undefined;
  let effective=0,presence=0,breaks=0; const incidents:CalculationIncident[]=[];
  for(const event of events){
    const at=new Date(event.occurredAt);
    if(Number.isNaN(at.getTime())) { incident(incidents,'INVALID_EVENT_TIME',event,'El instante del evento no es válido.'); continue; }
    if(event.eventType==='clock_in') {
      if(workStart||breakStart) incident(incidents,'CLOCK_IN_WHILE_OPEN',event,'Hay una entrada antes de cerrar la jornada anterior.');
      else { workStart=at; presenceStart=at; }
    } else if(event.eventType==='break_start') {
      if(!workStart) incident(incidents,'BREAK_START_WITHOUT_CLOCK_IN',event,'El inicio de pausa no tiene una entrada abierta.');
      else { effective+=minutes(workStart,at); workStart=undefined; breakStart=at; }
    } else if(event.eventType==='break_end') {
      if(!breakStart) incident(incidents,'BREAK_END_WITHOUT_BREAK_START',event,'El fin de pausa no tiene un inicio de pausa abierto.');
      else { breaks+=minutes(breakStart,at); breakStart=undefined; workStart=at; }
    } else if(event.eventType==='clock_out') {
      if(breakStart) { incident(incidents,'CLOCK_OUT_DURING_BREAK',event,'La salida se produjo con una pausa abierta.'); incident(incidents,'OPEN_BREAK',event,'La pausa no tiene un fin registrado.'); breakStart=undefined; presenceStart=undefined; }
      else if(!workStart||!presenceStart) incident(incidents,'CLOCK_OUT_WITHOUT_CLOCK_IN',event,'La salida no tiene una entrada abierta.');
      else { effective+=minutes(workStart,at); presence+=minutes(presenceStart,at); workStart=undefined; presenceStart=undefined; }
    }
  }
  if(breakStart) incident(incidents,'OPEN_BREAK',undefined,'La pausa quedó abierta; no se infiere su duración.');
  if(workStart||presenceStart) incident(incidents,'OPEN_WORKDAY',undefined,'La jornada quedó abierta; no se infiere tiempo tras el último evento.');
  if(new Set(events.map(e=>e.ruleVersionId)).size>1) incident(incidents,'MULTIPLE_RULE_VERSIONS',undefined,'La jornada contiene eventos con más de una versión de regla.');
  const expectedMinutes=expected(input.rule,input.laborDate);
  return {employeeId:input.employeeId,laborDate:input.laborDate,siteId:input.siteId,ruleVersionId:input.rule.ruleVersionId,effectiveTimeZone:input.rule.timeZone,sourceEventIds:events.map(e=>e.id),expectedMinutes,presenceMinutes:presence,effectiveMinutes:effective,registeredBreakMinutes:breaks,differenceMinutes:effective-expectedMinutes,excessMinutes:Math.max(0,effective-expectedMinutes-input.excessThresholdMinutes),excessIsInformational:true,incidents,algorithmVersion:ALGORITHM_VERSION};
}
