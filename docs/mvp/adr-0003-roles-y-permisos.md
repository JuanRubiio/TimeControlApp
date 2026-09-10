# ADR-0003 — Roles, permisos y alcance de autorización

**Estado:** Aprobado para el MVP el 09/09/2026.

## Decisión

Se adopta RBAC aplicado en servidor, con permisos atómicos y alcance explícito. Los roles iniciales son una asignación de permisos, no una fuente de autorización alternativa:

| Rol | Alcance máximo | Capacidades MVP |
|---|---|---|
| `employee` | su propia persona/relación laboral | fichar, consultar sus registros, proponer correcciones/incidencias y descargar sus exportaciones autorizadas |
| `manager` | empleados y centros asignados | consultar equipo, jornadas, eventos, cálculos e incidencias; revisar y decidir correcciones/incidencias de su ámbito; no administrar roles ni configuración global |
| `admin` | entorno de su cliente | gestionar estructura, personas, relaciones, reglas, asignaciones y exportaciones autorizadas; MFA obligatorio |
| `auditor` | sólo lectura, ámbito concedido | consultar evidencia y solicitar/descargar exportaciones autorizadas; no ficha, configura ni aprueba |
| `system` | sólo tarea técnica declarada | migración, jobs y despliegue con permiso mínimo y actor técnico auditado |

## Reglas

1. Cada solicitud se autoriza por identidad, permiso, entorno dedicado y ámbito de recurso (`self`, centro asignado o todo el cliente). Ser `admin` no cruza entornos dedicados.
2. La UI puede ocultar opciones, pero el servidor aplica la decisión final en ruta, acción y job.
3. La aprobación exige `corrections.decide` y relación de responsable válida sobre el empleado o centro a la fecha de la solicitud; no se autoriza por nombre de rol solamente.
4. Las asignaciones de rol y ámbito tienen vigencia, autor, motivo y auditoría. No se eliminan físicamente si pueden afectar evidencia previa.
5. Se deniega por defecto. Una autorización ambigua, un recurso inexistente o un ámbito no comprobable responde como no autorizado sin revelar datos del recurso.

## Catálogo mínimo de permisos

`company.read/write`, `site.read/write`, `employee.read:self/read:scope/write`, `employment.read/write`, `rule.read/write`, `time-event.create:self/read:self/read:scope/kiosk.manage`, `time-calculation.read:self/read:scope/recalculate:scope/configure`, `correction.create:self/read:self/read:scope/decide`, `audit.read:scope`, `export.create:scope/read:scope`, `role.assign`, `auth.admin`.

S1 define los nombres finales como constantes tipadas. S2–S9 sólo consumen el catálogo; añadir permisos o ampliar un ámbito requiere actualizar este ADR y los contratos de autorización.
