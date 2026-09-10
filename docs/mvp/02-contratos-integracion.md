# S0 — Contratos de integración: HTTP, eventos, errores y autorización

## HTTP y versionado

Base interna: `/api/v1`. JSON UTF-8; nombres `camelCase`; IDs UUID; instantes ISO-8601 UTC. Las mutaciones reciben `Idempotency-Key` cuando puedan duplicarse (obligatorio para fichaje). Una versión mayor incompatible crea `/api/v2`; añadir campos opcionales o nuevos valores documentados es compatible. API pública queda fuera del MVP: estos contratos son internos entre UI y monolito.

Toda respuesta de recurso incluye `id`, `createdAt`, `updatedAt` si procede y no expone secretos. Las rutas definitivas son propiedad de su sesión, respetando estas familias:

| Familia | Sesión | Operaciones iniciales |
|---|---|---|
| `/auth/*` | S1 | sesión, MFA, recuperación, revocación |
| `/companies`, `/sites`, `/employees`, `/employments` | S2 | CRUD con baja lógica |
| `/work-rules`, `/rule-versions`, `/calendars`, `/shifts` | S3 | configuración/versionado |
| `/time-events` | S4 | crear y listar evento propio/ámbito autorizado |
| `/corrections` | S6 | proponer, listar propio/ámbito y decidir |
| `/audit`, `/exports` | S9/S1 | lectura con ámbito y generación/descarga |

## S9 — Exportación de evidencia

`POST /exports` recibe `{format:"csv"|"pdf", employeeId|siteId, from:"YYYY-MM-DD", to:"YYYY-MM-DD"}`. Debe existir exactamente uno de `employeeId` o `siteId`; un período invertido o un alcance global sin filtro devuelve `VALIDATION_FAILED` o `EXPORT_SCOPE_TOO_BROAD`. Requiere `export.create:scope`, y el servidor vuelve a comprobar la persona/centro frente a la asignación efectiva del actor. La respuesta contiene `{id, manifest}`; el manifiesto no es una URL ni una credencial.

`GET /exports/{id}/download` requiere sesión y `export.read:scope`, vuelve a comprobar ámbito y vence los artefactos temporales. Devuelve bytes CSV UTF-8 con BOM o PDF y nunca una URL pública. Antes de entregar recalcula SHA-256 y lo compara con `manifest.contentHash`; una divergencia es error de integridad y se audita.

## Envolvente de error

```json
{"error":{"code":"TIME_EVENT_SEQUENCE_INVALID","message":"La operación no es válida para el estado actual.","details":{"expected":"clock_in"},"correlationId":"uuid"}}
```

`message` es español apto para UI; `code` es estable para clientes y pruebas. No se revela si un recurso de otro ámbito existe. Códigos transversales: `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `VALIDATION_FAILED` (422), `CONFLICT` (409), `IDEMPOTENCY_CONFLICT` (409), `RATE_LIMITED` (429), `INTERNAL_ERROR` (500). Códigos de dominio iniciales: `INVALID_DATETIME`, `TIME_EVENT_SEQUENCE_INVALID`, `RULE_VERSION_UNRESOLVABLE`, `CORRECTION_STATE_INVALID`, `APPROVAL_SCOPE_FORBIDDEN`, `EXPORT_SCOPE_TOO_BROAD`.

## Autorización de ruta

Cada mutación declara `permission`, `resourceType`, `scope` y el actor. Patrón obligatorio:

```ts
authorize({ actor, permission: 'time-event.create:self', resource: employee, scope: 'self' })
```

El manejador carga el recurso desde servidor, resuelve relación/centro/vigencia y autoriza antes de devolver o mutar datos. El contrato de respuesta 403/404 se decide de manera uniforme por familia para evitar enumeración.

## Eventos internos de dominio

Los eventos no son una API pública ni implican microservicios. Se publican tras confirmar la transacción mediante outbox/dispatcher equivalente; consumidores idempotentes por `eventId`.

```ts
interface DomainEvent<T> {
  eventId: string; name: string; occurredAt: string; environmentId: string;
  actor: { type: 'user' | 'system' | 'kiosk'; id?: string };
  correlationId: string; payload: T; schemaVersion: 1;
}
```

Nombres iniciales: `employee.created`, `employment.changed`, `rule-version.published`, `time-event.recorded`, `correction.requested`, `correction.decided`, `export.generated`, `auth.session.revoked`. Cada payload incluye IDs y referencias necesarias, nunca contraseña, token, PIN ni QR. S1 define el registro tipado; las sesiones versionan payload incompatible incrementando `schemaVersion` y mantienen consumidor compatible durante la transición.

## S6 — Correcciones y aprobaciones

- `POST /corrections`: empleado autenticado con `correction.create:self`. Cuerpo: `{kind, timeEventId? | dailyCalculationVersionId?, proposedEffect:{eventType,occurredAt}, reason}`. Sólo acepta evidencia propia y devuelve la solicitud `pending`.
- `GET /corrections?mine=true`: autoconsulta con `correction.read:self`. Responsable/autorizado usa `GET /corrections?employeeId={uuid}` o sin filtro con `correction.read:scope`, siempre limitado por centro servidor.
- `POST /corrections/{id}/decision`: responsable con `correction.decide`, ámbito de centro y cabecera `Idempotency-Key`. Cuerpo `{decision:"approved"}` o `{decision:"rejected",reason}`. Una repetición idéntica devuelve la decisión ya tomada; otra decisión devuelve `CONFLICT`.

Una aprobación crea `correction_effect` inmutable y publica `correction.decided` y `time-calculation.recalculation-requested`; el cálculo S5 incorpora ese efecto como fuente y conserva sus versiones. El evento S4 al que sustituye permanece sin cambios. S7 puede mostrar solicitudes propias y rechazo; S8 la cola de ámbito y la decisión; S9 puede unir solicitud, decisión, efecto, outbox y auditoría para evidencia, sin que S6 exporte archivos.

## Ampliación S8 — lectura administrativa de jornada

- `GET /time-events?employeeId={uuid}`: requiere `time-event.read:scope`; el servidor carga la persona, verifica que pertenece al entorno dedicado y que su centro está dentro del ámbito efectivo del actor. Sin `employeeId` mantiene el contrato de autoconsulta `time-event.read:self`.
- `GET /time-calculations?employeeId={uuid}&laborDate=YYYY-MM-DD`: requiere `time-calculation.read:scope` para una persona ajena y aplica el mismo ámbito de centro en servidor.
- El rol `manager` recibe ambos permisos de lectura de ámbito mediante migración aditiva S8. No recibe escritura de fichajes, reglas, estructura ni configuración de cálculo.
