# S6 — Correcciones y aprobaciones

**Objetivo:** resolver errores sin alterar la evidencia original. **Tamaño:** M. **Ejecución:** tras S1/S4.

## Alcance

Propietaria de `corrections`, `approvals` y sus rutas/API. Empleado propone corrección con motivo; responsable autorizado aprueba o rechaza. Las aprobaciones se aplican a correcciones/incidencias, no a toda jornada.

## Entregable y aceptación

El evento original permanece intacto; la corrección registra solicitante, motivo, fecha, decisión y aprobador; empleado ve estado y motivo de rechazo; no hay aprobación fuera de tenant/jerarquía.

## Dependencias y validación

Depende de S1/S4; puede operar en paralelo parcial con S5. Pruebas de estados, autorización, concurrencia y trazabilidad. Riesgo: corrección silenciosa o aprobación impropia.

## Diseño e implementación S6 — 10/09/2026

Estado: **implementada y validada localmente**. Base: `TimeControlApp/master` en `865b91a`; rama: `codex/s6-corrections-approvals`.

### Decisiones antes de editar

- `correction_requests` conserva de forma inmutable la referencia original (`time_event_id` o `daily_calculation_version_id`), el tipo de solicitud, propuesta estructurada, motivo, solicitante y fecha. No hay ruta ni privilegio de actualización/borrado para `time_events`.
- Una decisión `approved` crea exactamente un `correction_effect` aditivo e inmutable. El efecto puede sustituir un evento de fuente para cálculo o añadir el evento faltante de una incidencia; S5 combina efectos aprobados con la evidencia original y recalcula sólo `(employeeId, laborDate)` afectado. Un rechazo no produce efecto.
- Estados: `pending → approved | rejected`; no se permite volver a decidir. La decisión incluye huella de petición y se serializa con bloqueo asesor por solicitud: el mismo reintento devuelve la decisión ya registrada y una decisión distinta devuelve conflicto.
- Solicita: empleado con `correction.create:self`, exclusivamente su ficha. Lee: propio con `correction.read:self`; responsable con `correction.read:scope` y centro asignado. Decide: `correction.decide` y ámbito de centro; administrador tiene el permiso y ámbito de entorno. El motivo es obligatorio al solicitar y rechazar.
- Los eventos de auditoría append-only previstos son `correction.requested`, `correction.approved`, `correction.rejected`, `correction.effect.applied` y `time-calculation.recalculated`; el outbox publica `correction.decided` y `time-calculation.recalculation-requested`.

### Archivos y superficie prevista

- `migrations/s006_202609101900_corrections_approvals.sql` y `s006_202609101910_correction_immutability.sql`: solicitudes, decisiones, efectos, permisos y guardia SQL de inmutabilidad.
- `src/corrections/{contracts,validation,service,http}.ts` y rutas `/api/v1/corrections`, `/api/v1/corrections/{id}/decision`.
- Adaptador S6 para que S5 lea `correction_effects` aprobados como fuente aditiva, más pruebas de contrato/SQL, estados, autorización e integración.
- Contratos de lectura para S7/S8/S9: listado por actor/ámbito, decisión, referencias y efecto de recálculo; no se implementan pantallas ni exportaciones.

### Ambigüedad resuelta sin ampliar alcance

La reapertura no se entrega: no era uno de los estados mínimos ni se autorizó un flujo de reapertura. Si se aprobara en el futuro, será una nueva transición explícita, con permiso y auditoría propios; nunca se sobrescribirá una decisión.

### Validación real

- Docker con Node 20/PostgreSQL: `npm test` — **48 pruebas correctas en 15 suites**; `npx tsc --noEmit` — correcto; build de producción — correcto, incluidas las rutas S6.
- PostgreSQL local: migraciones S6 aplicadas tras S1–S5, sin reescribir migraciones previas.
- HTTP sobre los datos exclusivamente sintéticos existentes: una solicitud propia se aprobó, generó `correction_effect`, materializó recálculo S5 (revisión 1) y el reintento de decisión devolvió `replayed: true`. Consulta SQL posterior confirmó que el `time_event` original mantenía tipo e instante originales y que existían las auditorías de solicitud y aprobación.

### Contratos entregados

| Consumidor | Listo para consumir |
|---|---|
| S7 | `GET /api/v1/corrections?mine=true`, solicitud y estado/motivo de rechazo sin pantalla incluida. |
| S8 | Listado por ámbito, decisión idempotente con control servidor de permiso y centro; no incluye cola visual. |
| S9 | Solicitud, decisión, efecto, outbox y entradas append-only de auditoría con IDs correlacionables; no incluye exportación. |

### Riesgos y bloqueos

- La recalculación se ejecuta inmediatamente por la ruta de aprobación y queda también marcada en outbox para recuperación operativa. Un dispatcher fiable/reintento de outbox es responsabilidad transversal/S12.
- No hay reapertura, cadena de aprobaciones, delegación, SLA ni automatización masiva: quedan fuera de alcance.
