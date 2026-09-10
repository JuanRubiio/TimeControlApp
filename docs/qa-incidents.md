# Incidencias QA — S11

## QA-001 — El rol `employee` no recibe permisos de fichaje propios

Estado: abierto; propietaria sugerida: S1 (catálogo y asignación de permisos), con revisión de S4.

Evidencia: `migrations/s001_202609091700_foundations.sql` crea el rol `employee`, pero sólo asigna permisos a `admin` y, posteriormente en S2, a `manager`. No hay inserción que otorgue a `employee` `time-event.create:self` ni `time-event.read:self`; el endpoint S4 `/api/v1/time-events` los exige en servidor.

Impacto: una cuenta que sólo tenga el rol `employee` no puede registrar ni consultar sus propios fichajes. El seeder S11 conserva ese rol para revelar el problema y no lo elude otorgando privilegios administrativos. El flujo HTTP completo puede ejecutarse con una cuenta de administrador vinculada a empleado, pero no satisface mínimo privilegio para una demo de empleado.

Acción requerida: acordar en el contrato de permisos de S1 la asignación mínima de permisos de autoconsulta/autofichaje y entregar una migración aditiva de su sesión propietaria. S11 no modifica el catálogo ni las migraciones de S1/S4.
