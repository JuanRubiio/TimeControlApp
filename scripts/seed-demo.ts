import { randomUUID } from 'node:crypto';
import pg from 'pg';
import { hash } from '@node-rs/argon2';
import { DEMO_PASSWORD_ENV, DEMO_PROFILES, demoEmployees, type DemoProfile } from '../tests/support/demo-fixtures';

const profile=(process.env.DEMO_PROFILE ?? 'office') as DemoProfile;
const password=process.env[DEMO_PASSWORD_ENV] ?? '';
const databaseUrl=process.env.DATABASE_URL;
const environmentId=process.env.ENVIRONMENT_ID;
if (!(profile in DEMO_PROFILES)) throw new Error('DEMO_PROFILE debe ser office o multisite.');
if (!databaseUrl || !environmentId || password.length < 16) throw new Error('DATABASE_URL, ENVIRONMENT_ID y DEMO_PASSWORD (mínimo 16 caracteres) son obligatorios.');

async function main() {
  const client=new pg.Client({connectionString:databaseUrl}); await client.connect();
  const fixture=DEMO_PROFILES[profile]; const sites=new Map<string,{id:string;timeZone:string}>(fixture.sites.map((site)=>[site.key,site]));
  try {
    await client.query('BEGIN');
    const context=await client.query<{environment_id:string}>('SELECT environment_id FROM environment_context WHERE singleton=true');
    if (!context.rowCount || context.rows[0].environment_id !== environmentId) throw new Error('La base no pertenece al ENVIRONMENT_ID indicado o no está migrada.');
    const existing=await client.query<{id:string;name:string}>('SELECT id,name FROM companies WHERE environment_id=$1',[environmentId]);
    if (existing.rowCount && existing.rows[0].id !== fixture.company.id) throw new Error('Este entorno dedicado ya tiene otra empresa; use una base demo limpia para cambiar de perfil.');
    await client.query(`INSERT INTO companies(id,environment_id,name) VALUES($1,$2,$3)
      ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,is_active=true,deactivated_at=NULL,updated_at=clock_timestamp()`,[fixture.company.id,environmentId,fixture.company.name]);
    for (const site of fixture.sites) await client.query(`INSERT INTO sites(id,company_id,name,time_zone) VALUES($1,$2,$3,$4)
      ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,time_zone=EXCLUDED.time_zone,is_active=true,deactivated_at=NULL,updated_at=clock_timestamp()`,[site.id,fixture.company.id,site.name,site.timeZone]);
    const passwordHash=await hash(password);
    for (const employee of demoEmployees(profile)) {
      const site=siteFor(sites,employee.siteKey);
      await client.query(`INSERT INTO users(id,email,display_name,password_hash,is_active) VALUES($1,$2,$3,$4,true)
        ON CONFLICT(id) DO UPDATE SET email=EXCLUDED.email,display_name=EXCLUDED.display_name,password_hash=EXCLUDED.password_hash,is_active=true,updated_at=clock_timestamp()`,[employee.userId,employee.email,employee.displayName,passwordHash]);
      await client.query(`INSERT INTO employees(id,company_id,user_id,display_name,is_active) VALUES($1,$2,$3,$4,true)
        ON CONFLICT(id) DO UPDATE SET user_id=EXCLUDED.user_id,display_name=EXCLUDED.display_name,is_active=true,deactivated_at=NULL,updated_at=clock_timestamp()`,[employee.id,fixture.company.id,employee.userId,employee.displayName]);
      await client.query(`INSERT INTO employments(id,employee_id,site_id,effective_from) VALUES($1,$2,$3,'2026-01-01')
        ON CONFLICT(id) DO UPDATE SET site_id=EXCLUDED.site_id,effective_from=EXCLUDED.effective_from,effective_to=NULL,ended_at=NULL,updated_at=clock_timestamp()`,[`${employee.id.slice(0,8)}-9999-4999-8999-${employee.id.slice(-12)}`,employee.id,site.id]);
      await client.query(`INSERT INTO user_role_assignments(user_id,role_id,scope_type,scope_id,reason)
        SELECT $1,id,$3,$4,'seed-demo-sintetico' FROM roles WHERE code=$2 ON CONFLICT DO NOTHING`,[employee.userId,employee.role,employee.role==='manager'?'site':'environment',employee.role==='manager'?site.id:null]);
    }
    await client.query(`INSERT INTO calendars(id,name,time_zone,working_days,holidays) VALUES($1,$2,$3,$4,$5)
      ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,time_zone=EXCLUDED.time_zone,working_days=EXCLUDED.working_days,holidays=EXCLUDED.holidays,updated_at=clock_timestamp()`,[fixture.calendar.id,fixture.calendar.name,fixture.calendar.timeZone,JSON.stringify(fixture.calendar.workingDays),JSON.stringify(fixture.calendar.holidays)]);
    for (const shift of fixture.shifts) await client.query(`INSERT INTO shifts(id,name,segments) VALUES($1,$2,$3)
      ON CONFLICT(id) DO UPDATE SET name=EXCLUDED.name,segments=EXCLUDED.segments,updated_at=clock_timestamp()`,[shift.id,shift.name,JSON.stringify(shift.segments)]);
    for (const employee of demoEmployees(profile)) {
      const site=siteFor(sites,employee.siteKey); const shift=fixture.shifts.find((item)=>item.key===employee.schedule)!;
      const ruleId=`${employee.id.slice(0,8)}-7777-4777-8777-${employee.id.slice(-12)}`;
      const versionId=`${employee.id.slice(0,8)}-8888-4888-8888-${employee.id.slice(-12)}`;
      await client.query(`INSERT INTO work_rules(id,scope_type,scope_id,name) VALUES($1,'site',$2,$3)
        ON CONFLICT(id) DO UPDATE SET status='active',deactivated_at=NULL,updated_at=clock_timestamp()`,[ruleId,site.id,`Regla demo ${employee.schedule}`]);
      await client.query(`INSERT INTO rule_versions(id,work_rule_id,effective_from,time_zone,expected_minutes,pause_policy,calendar_id,shift_id,calendar_snapshot,shift_snapshot,created_by)
        VALUES($1,$2,'2026-01-01',$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT(id) DO UPDATE SET time_zone=EXCLUDED.time_zone,expected_minutes=EXCLUDED.expected_minutes,pause_policy=EXCLUDED.pause_policy,calendar_id=EXCLUDED.calendar_id,shift_id=EXCLUDED.shift_id,calendar_snapshot=EXCLUDED.calendar_snapshot,shift_snapshot=EXCLUDED.shift_snapshot`,[versionId,ruleId,site.timeZone,employee.schedule==='split'?480:480,JSON.stringify({mode:'manual_visible',autoDeduct:false}),fixture.calendar.id,shift.id,JSON.stringify(fixture.calendar),JSON.stringify({id:shift.id,name:shift.name,segments:shift.segments}),employee.userId]);
    }
    // Historia reproducible para recorridos E2E: jornadas completas, pausa,
    // jornada incompleta y un turno que cruza medianoche. Los eventos son sólo
    // inserts; nunca se actualiza la evidencia original.
    const fixtureEventId=(employeeId:string, order:number)=>`${employeeId.slice(0,8)}-d${String(order).padStart(3,'0')}-4000-8000-${employeeId.slice(-12)}`;
    for (const employee of demoEmployees(profile)) {
      const site=siteFor(sites,employee.siteKey); const employmentId=`${employee.id.slice(0,8)}-9999-4999-8999-${employee.id.slice(-12)}`; const versionId=`${employee.id.slice(0,8)}-8888-4888-8888-${employee.id.slice(-12)}`;
      const day=employee.schedule==='overnight'?'2026-01-10':'2026-01-12';
      const moments=employee.schedule==='overnight'
        ? [['clock_in','2026-01-10T21:00:00.000Z'],['break_start','2026-01-11T01:00:00.000Z'],['break_end','2026-01-11T01:20:00.000Z'],['clock_out','2026-01-11T05:00:00.000Z']]
        : [['clock_in','2026-01-12T08:00:00.000Z'],['break_start','2026-01-12T12:00:00.000Z'],['break_end','2026-01-12T12:20:00.000Z'],['clock_out','2026-01-12T16:20:00.000Z']];
      for (const [index, [eventType, occurredAt]] of moments.entries()) await client.query(`INSERT INTO time_events(id,employee_id,employment_id,site_id,rule_version_id,event_type,method,occurred_at,recorded_at,effective_time_zone,labor_date,created_by_user_id)
        VALUES($1,$2,$3,$4,$5,$6,'web',$7,$7,$8,$9,$10) ON CONFLICT(id) DO NOTHING`,[fixtureEventId(employee.id,index+1),employee.id,employmentId,site.id,versionId,eventType,occurredAt,site.timeZone,day,employee.userId]);
      await client.query(`INSERT INTO time_events(id,employee_id,employment_id,site_id,rule_version_id,event_type,method,occurred_at,recorded_at,effective_time_zone,labor_date,created_by_user_id)
        VALUES($1,$2,$3,$4,$5,'clock_in','web',$6,$6,$7,'2026-01-13',$8) ON CONFLICT(id) DO NOTHING`,[fixtureEventId(employee.id,5),employee.id,employmentId,site.id,versionId,'2026-01-13T08:00:00.000Z',site.timeZone,employee.userId]);
    }
    const admin=demoEmployees(profile)[0]; const adminSite=siteFor(sites,admin.siteKey); const adminVersionId=`${admin.id.slice(0,8)}-8888-4888-8888-${admin.id.slice(-12)}`;
    const correctionId=(order:number)=>`${admin.id.slice(0,8)}-e${String(order).padStart(3,'0')}-4000-8000-${admin.id.slice(-12)}`;
    const correctionRows=[
      {order:1,event:3,reason:'Pausa pendiente de revisión demo'},
      {order:2,event:1,reason:'Entrada propuesta para aprobación demo'},
      {order:3,event:2,reason:'Pausa propuesta para rechazo demo'}
    ] as const;
    for (const row of correctionRows) await client.query(`INSERT INTO correction_requests(id,employee_id,site_id,labor_date,kind,time_event_id,proposed_effect,reason,status,requested_by_user_id)
      VALUES($1,$2,$3,'2026-01-12','time_event',$4,$5,$6,'pending',$7) ON CONFLICT(id) DO NOTHING`,[correctionId(row.order),admin.id,adminSite.id,fixtureEventId(admin.id,row.event),JSON.stringify({eventType:row.event===2?'clock_in':'clock_out',occurredAt:'2026-01-12T08:05:00.000Z'}),row.reason,admin.userId]);
    await client.query('SELECT audit_append($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[environmentId,'system',null,'demo.seeded','demo-profile',profile,'success',randomUUID(),JSON.stringify({}),JSON.stringify({profile,synthetic:true})]);
    await client.query('COMMIT');
    console.log(JSON.stringify({seeded:true,profile,employees:demoEmployees(profile).length,synthetic:true}));
  } catch (error) { await client.query('ROLLBACK').catch(()=>undefined); throw error; } finally { await client.end(); }
}
function siteFor(sites:Map<string,{id:string;timeZone:string}>, key:string) { const site=sites.get(key); if (!site) throw new Error('Fixture demo inválido: centro ausente.'); return site; }
main().catch((error)=>{ console.error(error instanceof Error ? error.message : error); process.exitCode=1; });
