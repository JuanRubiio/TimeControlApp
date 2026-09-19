import { db } from '@/shared/db';
import { config } from '@/shared/config';
import { assertAuthorized, type ScopedActor } from '@/permissions/authorizer';
import { currentCalculation, publishedWorkdayForEmployee } from '@/time-calculation/service';

export type TeamOperationalSnapshot = {
  employee:{id:string;displayName:string};
  site:{id:string;name:string};
  laborDate:string;
  imputation:{status:'without_records'|'recorded'|'with_incidents';effectiveMinutes:number;expectedMinutes:number|null;differenceMinutes:number|null};
  locationVerification:'not_recorded'|'punctual_verified';
};

type ScopedEmployee={id:string;displayName:string;siteId:string;siteName:string};

/**
 * Lectura operativa mínima para responsables. El ámbito se fija antes de
 * consultar cada jornada y la señal geográfica sólo comunica que existió una
 * verificación puntual: nunca devuelve coordenadas, precisión ni dispositivo.
 */
export async function teamOperationalSnapshot(actor:ScopedActor,asOf=new Date().toISOString()):Promise<TeamOperationalSnapshot[]> {
  assertAuthorized(actor,'time-calculation.read:scope');
  const siteIds=actor.scopes?.filter(scope=>scope.type==='site'&&scope.id).map(scope=>scope.id!)??[];
  const environment=actor.scopes?.some(scope=>scope.type==='environment')??false;
  if(!environment&&!siteIds.length)return [];
  const scope=environment?'':` AND em.site_id = ANY($2::uuid[])`;
  const params=environment?[config.ENVIRONMENT_ID]:[config.ENVIRONMENT_ID,siteIds];
  const people=(await db.query<ScopedEmployee>(`SELECT DISTINCT ON (e.id) e.id,e.display_name AS "displayName",s.id AS "siteId",s.name AS "siteName"
    FROM employees e
    JOIN companies c ON c.id=e.company_id
    JOIN employments em ON em.employee_id=e.id AND em.effective_from<=CURRENT_DATE AND (em.effective_to IS NULL OR em.effective_to>CURRENT_DATE)
    JOIN sites s ON s.id=em.site_id
    WHERE c.environment_id=$1 AND c.is_active AND e.is_active AND s.is_active${scope}
    ORDER BY e.id,em.effective_from DESC`,params)).rows;
  return Promise.all(people.map(async(person)=>{
    const published=await publishedWorkdayForEmployee(person.id,asOf);
    const laborDate=published?.laborDate??new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Madrid'}).format(new Date(asOf));
    const calculation=await currentCalculation(person.id,laborDate);
    const verified=(await db.query<{verified:boolean}>(`SELECT EXISTS(
      SELECT 1 FROM time_events event
      JOIN time_event_geo_verifications verification ON verification.event_id=event.id
      WHERE event.employee_id=$1 AND event.labor_date=$2::date
    ) AS verified`,[person.id,laborDate])).rows[0]?.verified??false;
    return {
      employee:{id:person.id,displayName:person.displayName},site:{id:person.siteId,name:person.siteName},laborDate,
      imputation:{
        status:!published?.evidence.status||published.evidence.status==='no_evidence'?'without_records':calculation?.incidents.length?'with_incidents':'recorded',
        effectiveMinutes:calculation?.effectiveMinutes??0,
        expectedMinutes:published?.schedule?.expectedMinutes??null,
        differenceMinutes:calculation?.differenceMinutes??null
      },
      locationVerification:verified?'punctual_verified':'not_recorded'
    };
  }));
}
