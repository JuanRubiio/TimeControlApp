import { db } from '@/shared/db';
import { config } from '@/shared/config';
import type { EmploymentContext, EmploymentScopeProvider } from '@/work-rules/contracts';

function assertUtcInstant(at:string) { const value=new Date(at); if (Number.isNaN(value.getTime()) || !/Z$/i.test(at)) throw new Error('INVALID_DATETIME'); }

/** Adaptador S2 del puerto de S3. No expone repositorios ni tablas de S2. */
export class PostgresEmploymentScopeProvider implements EmploymentScopeProvider {
  async contextForEmployee(employeeId:string, at:string):Promise<EmploymentContext|null> {
    assertUtcInstant(at);
    const result=await db.query<{employmentId:string;companyId:string;siteId:string;effectiveTimeZone:string}>(`SELECT em.id AS "employmentId", c.id AS "companyId", s.id AS "siteId", s.time_zone AS "effectiveTimeZone"
      FROM employments em JOIN employees e ON e.id=em.employee_id JOIN sites s ON s.id=em.site_id JOIN companies c ON c.id=e.company_id
      WHERE em.employee_id=$1 AND e.is_active=true AND s.is_active=true AND c.is_active=true AND c.environment_id=$3
        AND em.effective_from <= ($2::timestamptz AT TIME ZONE s.time_zone)::date
        AND (em.effective_to IS NULL OR em.effective_to > ($2::timestamptz AT TIME ZONE s.time_zone)::date)
      ORDER BY em.effective_from DESC LIMIT 1`,[employeeId,at,config.ENVIRONMENT_ID]);
    const row=result.rows[0];
    return row ? {...row,scopes:[{type:'company',id:row.companyId},{type:'site',id:row.siteId}]} : null;
  }
}
