# S8 — Vista de administración y RR. HH.

**Objetivo:** permitir operar plantilla, incidencias y revisión sin acceso excesivo. **Tamaño:** M. **Ejecución:** tras S2/S5/S6.

## Registro de implementación S8 — 10/09/2026

Estado: **implementada, validada y publicada**. Base: `TimeControlApp/master` `32e566d`; rama `codex/s8-admin-hr`.

### Matriz de visibilidad efectiva

| Perfil | Lectura/decisión S8 |
|---|---|
| Administrador | Todo el entorno dedicado, conforme a sus permisos S1. |
| RR. HH. | No existe rol base separado: obtiene exactamente los permisos y ámbitos explícitos que se le asignen. |
| Responsable | Personas, centros, eventos, cálculos, incidencias y correcciones de centros asignados; puede decidir correcciones sólo allí. |
| Empleado | No puede acceder a `admin/*`; mantiene sus rutas S7. |

La migración aditiva `s008_202609102100_admin_scope_reads.sql` concede a `manager` únicamente `time-event.read:scope` y `time-calculation.read:scope`. La API sigue comprobando permiso, entorno, persona y centro en servidor. No concede escritura de evidencia, reglas ni configuración.

### Rutas, componentes y contratos consumidos

- `/admin`: resumen de plantilla, centros, incidencias recientes y solicitudes pendientes.
- `/admin/people`: filtros autorizados por centro, persona, estado de incidencia y período; detalle de jornada con eventos originales, pausas, cálculo, regla/versionado, zona e incidencias.
- `/admin/corrections` y `/admin/corrections/[id]`: bandeja, origen, propuesta, motivo, trazabilidad de decisión y aprobación/rechazo S6; rechazar exige motivo.
- `GET /api/v1/admin/workdays`: adaptador de lectura S8 sobre las proyecciones S5; sólo devuelve centros autorizados y valida períodos. No modifica evidencia de S4/S5.
- S2: `GET /sites`, `GET /employees`; S4: ampliación compatible de `GET /time-events?employeeId`; S5: cálculo de ámbito; S6: listado y decisión idempotente.

Los datos de cada pantalla se limitan a nombre visible, centro/zona, fecha laboral, evidencia, cálculo, incidencia, regla/versionado y actores/momentos de la solicitud. No se muestra ni incorpora domicilio, identificador personal, nómina, GPS, biometría, cámara, fotografía, vídeo o secreto.

### Riesgos y bloqueos

- La nueva lectura administrativa depende de que la migración S8 esté aplicada antes de que un responsable acceda; administrador conserva sus permisos globales existentes.
- No se implementan exportaciones, CSV/PDF ni paquete de inspección; S9 puede consumir los IDs correlacionables de evento, cálculo, corrección, decisión y auditoría ya presentados.

### Validación real

- Imagen Docker reconstruida: `npm test` — 19 suites y 58 pruebas correctas; `tsc --noEmit` y build de producción correctos.
- E2E HTTP en proyecto Docker temporal `timecontrolapp_s8e2e`, base nueva y sólo perfil `office` sintético: empleado creó solicitudes; responsable aprobó una y rechazó otra. El rechazo sin motivo devolvió 422 y el empleado observó los estados y motivo resultantes.
- RBAC E2E: responsable leyó jornadas de su ámbito; empleado recibió 403 en `admin/workdays` y en lectura de fichajes de otra persona.

## Alcance

Propietaria de `admin/*`: plantilla, centros, reglas, incidencias, aprobaciones y filtros por período/centro. No incluye portal avanzado de asesoría ni nómina.

## Entregable y aceptación

Administrador autorizado configura dominio y revisa incidencias; responsable sólo accede a equipo asignado; filtros no cruzan tenant; decisiones quedan auditadas.

## Dependencias y validación

Depende de S2/S5/S6. Pruebas RBAC, filtros, carga y flujos de aprobación. Riesgo: privilegios demasiado amplios o interfaz que permita cambios de regla retroactivos.
