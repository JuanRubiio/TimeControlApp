# S2 — Empresa, centros y personas

**Objetivo:** permitir administrar estructura laboral mínima por tenant. **Tamaño:** M. **Ejecución:** paralela tras S1.

## Alcance

Propietaria de `companies`, `sites`, `employees`, `employment`. CRUD de empresa, centro, empleado y relación laboral básica; bajas lógicas; asignación de responsable/centro. No contiene reglas de jornada ni fichajes.

## Entregable y aceptación

Administración crea y desactiva centros/empleados autorizados; empleado sólo ve su ficha mínima; los datos se limitan a lo necesario; validación de pertenencia a tenant y centro; auditoría de altas/bajas.

## Dependencias y validación

Depende de S1. Paralela con S3/S4/S10/S11/S12. Pruebas CRUD, autorización, baja lógica y aislamiento. Riesgo: datos laborales excesivos o relaciones ambiguas entre empleado, centro y contrato.

## Registro de implementación S2 — 10/09/2026

Estado: **implementada; validación automatizada de S2 correcta**.

### Decisiones aplicadas

- Cada base dedicada contiene como máximo una empresa, unida de forma única al `environment_context` singleton. No existe `tenant_id`, selector de cliente HTTP ni partición compartida por filas.
- `Company` conserva nombre e identificador legal opcional; `Site`, nombre y zona IANA; `Employee`, nombre de presentación y vínculo opcional con `User`. No se persisten domicilio, fecha de nacimiento, documento personal, biometría, GPS ni datos de nómina.
- Centros, empleados y empresa se dan de baja lógicamente. Las relaciones laborales conservan vigencia `[effectiveFrom, effectiveTo)`, centro y responsable opcional; PostgreSQL impide intervalos solapados del mismo empleado. Un responsable debe ser otro empleado activo con relación vigente en el mismo centro.
- Los permisos S1 se consumen en servidor. La extensión compatible de `Actor.scopes` hace efectivo el alcance `environment` o `site` de las asignaciones RBAC existentes; el rol `manager` recibe sólo lectura de centro, personas y relaciones dentro de sus centros asignados. Las operaciones administrativas requieren permisos de escritura ya exclusivos del administrador.
- Cada alta, cambio, baja de empresa/centro/empleado y alta, cambio o fin de relación usa `audit_append`; los resúmenes de auditoría minimizan los datos registrados.

### Superficie entregada

- Módulos `src/company-people/{schemas,service,http}.ts` y rutas `/api/v1/companies`, `/sites`, `/employees`, `/employees/me` y `/employments`, incluidas sus rutas por identificador.
- Migración `s002_202609101000_company_people.sql`, separada e inmutable respecto de S1, con privilegios mínimos para `mvp_app`.
- Pruebas de validaciones de entrada, ámbitos de responsable y propiedades SQL de aislamiento, minimización, baja lógica e integridad temporal.

### Validaciones realizadas

- `npx vitest run tests/company-people.test.ts tests/company-people-sql.test.ts tests/permissions.test.ts tests/audit-sql.test.ts`: 11 pruebas correctas.
- `npm test`: 17 pruebas correctas, incluidas las suites paralelas ya integradas.
- `npx tsc --noEmit`: correcto.
- Configuración Docker y migraciones comprobadas contra la base local: `s001`, `s002` y la migración paralela `s003` constan aplicadas.

Los cambios paralelos de S3 permanecen fuera de la propiedad funcional de S2; la ejecución conjunta actual es correcta.

### Integración posterior con S3

S2 publica `PostgresEmploymentScopeProvider` como adaptador del contrato de S3. Para un `occurredAt` ISO-8601 UTC resuelve atómicamente la relación laboral vigente según la fecha local del centro, empresa, centro, zona IANA efectiva y los alcances `company` y `site`. La consulta valida la pertenencia al entorno dedicado y conserva la capacidad de resolver historia aunque el centro o empleado se haya desactivado después. `collective` no se devuelve: no existe todavía un modelo propietario para ese alcance y añadirlo queda fuera de S2.
