export const CORRECTION_STATUSES=['pending','approved','rejected'] as const;
export type CorrectionStatus=typeof CORRECTION_STATUSES[number];
export type CorrectionKind='time_event'|'calculation_incident';
export type ProposedEffect={eventType:'clock_in'|'clock_out'|'break_start'|'break_end';occurredAt:string};
export type CorrectionRequest={id:string;employeeId:string;siteId:string;laborDate:string;kind:CorrectionKind;timeEventId:string|null;dailyCalculationVersionId:string|null;proposedEffect:ProposedEffect;reason:string;status:CorrectionStatus;requestedByUserId:string;requestedAt:string;decision:{id:string;decision:'approved'|'rejected';reason:string|null;decidedByUserId:string;decidedAt:string}|null;effectId:string|null};
