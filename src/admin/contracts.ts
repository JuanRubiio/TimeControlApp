import type { TimeEvent } from '@/time-events/contracts';
import type { PersistedDailyCalculation } from '@/time-calculation/contracts';

export type AdminWorkday = {
  employee: { id:string; displayName:string };
  site: { id:string; name:string; timeZone:string };
  calculation: PersistedDailyCalculation;
  events?: TimeEvent[];
};
