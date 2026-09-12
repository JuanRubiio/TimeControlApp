# S4 — Fichaje de entrada, salida y pausas

**Objetivo:** registrar eventos diarios fiables y no invasivos. **Tamaño:** L. **Estado: implementada y validada localmente con PostgreSQL/Docker; pendiente sólo E2E de lector QR físico previo a piloto.**

## Alcance

Propietaria de `time-events`, API y UI/PWA de fichaje, QR dinámico y PIN de kiosco. Métodos aprobados: web responsive, QR y PIN. Incluye entrada, salida, inicio/fin de pausa, idempotencia, timestamps servidor/dispositivo y sincronización básica.

## Exclusiones

No GPS, biometría, reconocimiento facial, foto, vídeo, rastreo continuo ni app nativa.

## Entregable y aceptación

El sistema no sobrescribe eventos; rechaza secuencias imposibles o duplicados explicando el error; crea evento auditado con método y regla aplicable; funciona en móvil web. QR es dinámico y PIN no revela información sensible.

## Dependencias y validación

Depende de S1; consume interfaz de reglas de S3 mediante mock si hace falta. Bloquea S5–S7. Pruebas E2E de entrada/salida/pausas, dobles clics, medianoche, cambio horario, tenant y permisos. Riesgo: inconsistencia temporal o suplantación básica.

## Registro de implementación S4 — 10/09/2026

### Contratos consumidos

- **S1:** `currentActor`, permisos tipados, cookie de sesión y `audit_append`. Las mutaciones se autorizan en servidor; la auditoría se invoca dentro de la transacción de fichaje. Se publica `time-event.recorded` en `domain_event_outbox` para consumidores S5/S6/S7/S9.
- **S2:** `PostgresEmploymentScopeProvider` resuelve para el instante de servidor la relación laboral vigente, empresa, centro y zona IANA. No se acepta un empleado, centro o empresa procedente de la UI como fuente de autoridad.
- **S3:** `PostgresRuleResolver` selecciona la versión de regla aplicable. El evento fija `ruleVersionId`, centro, zona efectiva y fecha laboral, por lo que un cambio futuro de reglas no reescribe historia.

### Modelo y secuencia

`time_events` es append-only y conserva `employeeId`, `employmentId`, `siteId`, `ruleVersionId`, `eventType`, método, `occurredAt` y `recordedAt` UTC de servidor, `deviceOccurredAt` UTC opcional/no confiable, zona IANA y fecha laboral. No hay permisos SQL ordinarios de `UPDATE` o `DELETE` sobre esta tabla.

La máquina de estados permitida es: sin eventos/salida anterior → entrada; trabajando → inicio de pausa o salida; en pausa → fin de pausa; tras fin de pausa → inicio de otra pausa o salida. Cualquier otra transición devuelve `TIME_EVENT_SEQUENCE_INVALID`. Las pausas no descuentan minutos: S5 calculará con la evidencia explícita y la regla fijada.

### API interna

| Ruta | Uso |
|---|---|
| `GET/POST /api/v1/time-events` | lectura propia y fichaje web; `POST` exige `Idempotency-Key` |
| `POST /api/v1/time-events/kiosk/qr` | fichaje autenticado mediante desafío QR temporal |
| `POST /api/v1/time-events/kiosk/pin` | fichaje desde kiosco con PIN individual |
| `POST /api/v1/kiosks` | crea una sesión de kiosco por centro (`time-event.kiosk.manage`) |
| `GET /api/v1/kiosks/{publicId}/qr.svg` | QR SVG local con desafío opaco renovado, máximo dos minutos |
| `PUT /api/v1/time-events/kiosk/pins/{employeeId}` | alta/rotación de PIN por administrador autorizado |

El kiosco obtiene un QR SVG generado localmente a partir de una URL/payload opaco temporal; no contiene nombre, empleado, centro ni secreto persistente. La PWA no pide cámara: el sistema operativo o lector externo puede abrir la URL. El PIN sólo se persiste como HMAC indexado con *pepper* de entorno más Argon2id; nunca se devuelve, registra ni audita. Cinco fallos bloquean el PIN quince minutos. El valor `KIOSK_PIN_PEPPER` es secreto obligatorio cuando se usa PIN en ejecución; se valida al arrancar esa operación para permitir que Next construya la imagen sin secretos incrustados.

### Concurrencia, idempotencia y privacidad

La escritura adquiere `pg_advisory_xact_lock` por empleado, consulta la última evidencia y crea evento, idempotencia, outbox y auditoría en una sola transacción. `time_event_idempotency` tiene clave primaria `(employee_id, idempotency_key)` y huella del comando: el mismo reintento devuelve el evento confirmado; reutilizar la clave para otro comando devuelve `IDEMPOTENCY_CONFLICT`. Esto cubre doble clic, reintento HTTP y concurrencia.

No se añadió geolocalización, GPS, biometría, reconocimiento facial, foto, vídeo, vigilancia, cámara ni permisos de dispositivo. La UI responsive sólo muestra las acciones válidas y el historial propio; el servidor conserva la decisión final.

### Archivos y migración

- `migrations/s004_202609101500_time_events.sql`: evidencia, idempotencia, outbox y kiosco; aditiva y segura al reintento. Rollback de aplicación: detener las rutas S4; no borrar evidencia ni credenciales creadas.
- `src/time-events/{contracts,validation,service,http,ui}.ts` y rutas `src/app/api/v1/{time-events,kiosks}`: dominio, API y UI/PWA.
- `src/app/{manifest.ts,globals.css,page.tsx,kiosk/page.tsx}`: manifiesto PWA, fichaje web móvil y pantalla de PIN de kiosco (`/kiosk?publicKioskId={id}`).
- `tests/time-events.test.ts`: secuencia, UTC/DST, idempotencia SQL e imposibilidad de PIN/QR en claro.

### Validación realizada y pendientes

- Correcto: `npm test` — 25 pruebas correctas en 8 suites, incluidas las cinco de S4.
- Correcto: `npx tsc --noEmit`.
- Correcto: `npm audit` con Node 20 — 0 vulnerabilidades (Vitest 4.1.11/Vite 7.2.6 actualizados para eliminar la cadena vulnerable de pruebas).
- Correcto: `docker compose build app` — compilación de producción con Node 20 y todas las rutas S4.
- Correcto: base PostgreSQL limpia en Docker — migraciones S1–S4 aplicadas y aplicación arrancada.
- Correcto: E2E HTTP sintético — login/MFA, empresa, centro, empleado, relación, regla, entrada → pausa → fin de pausa → salida, reintento idempotente, PIN de kiosco y QR SVG dinámico.
- Correcto: negativas/E2E de concurrencia — 401 sin sesión, 409 para secuencia inválida y dos solicitudes simultáneas con la misma clave devolvieron 201/200 (confirmación/repetición).
- Pendiente antes de piloto: una lectura física del QR y una prueba de rate-limit a nivel de proxy/infraestructura. El runtime del host sigue en Node 18.12.1; las comprobaciones de build y E2E se realizaron dentro de Docker con Node 20, conforme al contrato.

### Riesgos y traspaso

- **S5:** debe consumir `time-event.recorded`/`time_events` como evidencia inmutable y nunca inferir una pausa no registrada.
- **S6:** debe crear correcciones aditivas contra `time_events.id`; no hay ruta de edición ni borrado de fichajes.
- **S7:** puede reutilizar `GET /time-events`, la misma máquina de estados y la presentación con `effectiveTimeZone`.
- **S9:** debe extraer `time_events`, `domain_event_outbox` y auditoría con los IDs/versiones fijados; no exportar PIN, QR ni `deviceOccurredAt` salvo finalidad justificada.
- Antes de piloto debe probarse el QR SVG desde un lector real, junto con E2E de kiosco y prueba real de rate-limit para PIN.

### Enmienda S19 aprobada — 12/09/2026

S4 amplía aditivamente `time-event.recorded` en `domain_event_outbox` con `eventId`, `employeeId`, `laborDate`, tipo, centro, regla, método e instante. La clave de deduplicación es el `id` inmutable del outbox; el evento se inserta en la misma transacción que el fichaje, pero su consumo no bloquea ni revierte una confirmación. S4 no interpreta ni recalcula: S5/S19 es propietario de consumidor, reintento y materialización.
