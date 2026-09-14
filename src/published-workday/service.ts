import type { ScopedActor } from '@/permissions/authorizer';
import { assertAuthorized } from '@/permissions/authorizer';
import { db } from '@/shared/db';
import { employeeForUser } from '@/time-events/service';
import { publishedWorkdayForEmployee } from '@/time-calculation/service';
import type { PublishedWorkday } from '@/time-calculation/contracts';

/** S23: proyección propia, de servidor y sólo de lectura de la jornada publicada. */
export async function ownPublishedWorkday(actor:ScopedActor):Promise<PublishedWorkday>{
  assertAuthorized(actor,'time-event.read:self');
  const employeeId=await employeeForUser(actor.id); if(!employeeId)throw new Error('PUBLISHED_WORKDAY_NOT_FOUND');
  const asOf=(await db.query<{asOf:Date}>('SELECT clock_timestamp() AS "asOf"')).rows[0].asOf.toISOString();
  const workday=await publishedWorkdayForEmployee(employeeId,asOf); if(!workday)throw new Error('PUBLISHED_WORKDAY_NOT_FOUND');
  return workday;
}
