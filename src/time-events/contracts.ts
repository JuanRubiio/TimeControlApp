export const TIME_EVENT_TYPES = ['clock_in','clock_out','break_start','break_end'] as const;
export type TimeEventType = typeof TIME_EVENT_TYPES[number];
export const TIME_EVENT_METHODS = ['web','kiosk_qr','kiosk_pin'] as const;
export type TimeEventMethod = typeof TIME_EVENT_METHODS[number];
export type TimeEvent = {
  id:string; employeeId:string; employmentId:string; siteId:string; ruleVersionId:string;
  eventType:TimeEventType; method:TimeEventMethod; occurredAt:string; recordedAt:string;
  deviceOccurredAt:string|null; effectiveTimeZone:string; laborDate:string;
};

const NEXT: Record<TimeEventType | 'none', readonly TimeEventType[]> = {
  none:['clock_in'], clock_in:['break_start','clock_out'], break_start:['break_end'], break_end:['break_start','clock_out'], clock_out:['clock_in']
};
export function assertSequence(previous:TimeEventType|undefined, next:TimeEventType) {
  if (!NEXT[previous ?? 'none'].includes(next)) throw new Error('TIME_EVENT_SEQUENCE_INVALID');
}
