import type { ScopedActor } from '@/permissions/authorizer';
import { assertAuthorized } from '@/permissions/authorizer';
import { db } from '@/shared/db';
import { employeeForUser } from '@/time-events/service';
import { effectiveWorkday } from '@/time-calculation/service';
import { projectWorkday, type WorkdayStatus } from './contracts';

/** Proyección temporal S18: lectura propia, hora de servidor y sin escrituras. */
export async function ownWorkdayStatus(actor:ScopedActor):Promise<WorkdayStatus>{
  assertAuthorized(actor,'time-event.read:self');
  const employeeId=await employeeForUser(actor.id); if(!employeeId)throw new Error('WORKDAY_STATUS_NOT_FOUND');
  const asOf=(await db.query<{asOf:Date}>('SELECT clock_timestamp() AS "asOf"')).rows[0].asOf.toISOString();
  const workday=await effectiveWorkday(employeeId,asOf); if(!workday)throw new Error('WORKDAY_STATUS_NOT_FOUND');
  return projectWorkday(workday,asOf);
}
