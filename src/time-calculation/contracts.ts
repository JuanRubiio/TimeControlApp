import type { ResolvedRule } from '@/work-rules/contracts';

export const ALGORITHM_VERSION = 's5.v1';
export type CalculationEventType = 'clock_in'|'clock_out'|'break_start'|'break_end';
export type CalculationEvent = { id:string; eventType:CalculationEventType; occurredAt:string; ruleVersionId:string };
export type CalculationIncidentCode = 'CLOCK_OUT_WITHOUT_CLOCK_IN'|'BREAK_START_WITHOUT_CLOCK_IN'|'BREAK_END_WITHOUT_BREAK_START'|'CLOCK_IN_WHILE_OPEN'|'CLOCK_OUT_DURING_BREAK'|'OPEN_WORKDAY'|'OPEN_BREAK'|'INVALID_EVENT_TIME'|'MULTIPLE_RULE_VERSIONS';
export type CalculationIncident = { code:CalculationIncidentCode; eventId?:string; message:string };
export type DailyCalculation = {
  employeeId:string; laborDate:string; siteId:string; ruleVersionId:string; effectiveTimeZone:string;
  sourceEventIds:string[]; expectedMinutes:number; presenceMinutes:number; effectiveMinutes:number;
  registeredBreakMinutes:number; differenceMinutes:number; excessMinutes:number;
  excessIsInformational:true; incidents:CalculationIncident[]; algorithmVersion:string;
};
export type CalculationInput = { employeeId:string; laborDate:string; siteId:string; events:readonly CalculationEvent[]; rule:ResolvedRule; excessThresholdMinutes:number };
export type PersistedDailyCalculation = DailyCalculation & { id:string; revision:number; inputHash:string; calculatedAt:string };
