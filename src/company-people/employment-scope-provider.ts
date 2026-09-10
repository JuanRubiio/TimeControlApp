import { db } from '../shared/db';
import { config } from '../shared/config';
import type { EmploymentContext, EmploymentScopeProvider } from '../work-rules/contracts';

type EmploymentRow = { employmentId:string; companyId:string; siteId:string; effectiveTimeZone:string };
type Query = (text:string, values: unknown[]) => Promise<{ rows: EmploymentRow[] }>;

export const activeEmploymentContextSql = `SELECT em.id AS "employmentId", c.id AS "companyId", s.id AS "siteId", s.time_zone AS "effectiveTimeZone"
  FROM employments em
  JOIN employees e ON e.id=em.employee_id
  JOIN companies c ON c.id=e.company_id
  JOIN sites s ON s.id=em.site_id AND s.company_id=c.id
  WHERE e.id=$1 AND c.environment_id=$2
    AND em.effective_from <= (($3::timestamptz AT TIME ZONE s.time_zone)::date)
    AND (em.effective_to IS NULL OR em.effective_to > (($3::timestamptz AT TIME ZONE s.time_zone)::date))
  LIMIT 1`;

function assertUtcInstant(occurredAt:string) {
  if (!/Z$/i.test(occurredAt) || Number.isNaN(new Date(occurredAt).getTime())) throw new Error('INVALID_DATETIME');
}

/** S2 adapter; it exposes only the resolved employment context, never its tables. */
export class PostgresEmploymentScopeProvider implements EmploymentScopeProvider {
  constructor(private readonly query:Query=(text,values)=>db.query<EmploymentRow>(text,values)) {}

  async contextForEmployee(employeeId:string, occurredAt:string):Promise<EmploymentContext|null> {
    assertUtcInstant(occurredAt);
    const row=(await this.query(activeEmploymentContextSql,[employeeId,config.ENVIRONMENT_ID,occurredAt])).rows[0];
    if (!row) return null;
    return { employmentId:row.employmentId, companyId:row.companyId, siteId:row.siteId, effectiveTimeZone:row.effectiveTimeZone, scopes:[{type:'company',id:row.companyId},{type:'site',id:row.siteId}] };
  }
}
