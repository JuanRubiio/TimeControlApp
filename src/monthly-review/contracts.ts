export type MonthlyReviewDay={laborDate:string;expectedMinutes:number|null;effectiveMinutes:number|null;differenceMinutes:number|null;incidents:number;pendingCorrections:number;holiday:string|null;leave:string|null};
export type MonthlyReviewStatus='no_data'|'ready'|'reviewed'|'requires_review';
export type MonthlyReview={period:string;availablePeriods:string[];timeZone:string;days:MonthlyReviewDay[];status:MonthlyReviewStatus;reviewedAt:string|null;summary:{calculatedDays:number;expectedMinutes:number;effectiveMinutes:number;differenceMinutes:number;incidentDays:number;pendingCorrections:number};};

export const monthPattern=/^\d{4}-(0[1-9]|1[0-2])$/;
export const monthStart=(period:string)=>`${period}-01`;
export function priorMonths(currentPeriod:string,count=12){const value=new Date(`${currentPeriod}-01T12:00:00.000Z`);return Array.from({length:count},()=>{value.setUTCMonth(value.getUTCMonth()-1);return value.toISOString().slice(0,7);});}
export function summarize(days:readonly MonthlyReviewDay[]){return {calculatedDays:days.filter(day=>day.effectiveMinutes!==null).length,expectedMinutes:days.reduce((total,day)=>total+(day.expectedMinutes??0),0),effectiveMinutes:days.reduce((total,day)=>total+(day.effectiveMinutes??0),0),differenceMinutes:days.reduce((total,day)=>total+(day.differenceMinutes??0),0),incidentDays:days.filter(day=>day.incidents>0).length,pendingCorrections:days.reduce((total,day)=>total+day.pendingCorrections,0)};}
