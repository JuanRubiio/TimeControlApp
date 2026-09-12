# S19 — Acceso protegido, entrada controlada y consistencia del historial

**Objetivo:** impedir que una persona sin sesión acceda a las pantallas privadas, definir la excepción mínima y segura de kiosco, y hacer explícito y fiable el estado de cálculo de las jornadas históricas sin alterar eventos originales.

**Estado:** parcialmente completada: navegación protegida, entrada controlada, kiosco PIN acotado y mensajes de historial entregados; consumidor/reintento/reparación histórica bloqueados hasta enmienda S4/S5.
**Tamaño:** M.
**Rama prevista:** `codex/s19-acceso-historial`, desde `TimeControlApp/master`.

## Contexto y evidencia

Con una solicitud anónima al entorno sintético se verificó que `/employee`, `/employee/history`, `/admin` y `/kiosk` devolvían `200`. Las APIs mantienen autorización en servidor, pero las pantallas privadas cargan su estructura visual antes de que fallen sus peticiones, lo que no satisface la navegación protegida esperada.

La ruta `/` renderiza directamente el componente de fichaje y no decide destino. Además, el detalle de historial captura cualquier fallo de `GET /api/v1/time-calculations` y muestra el mismo mensaje de ausencia de cálculo. Un día con eventos puede no tener una proyección materializada en `daily_calculations`: S4 publica `time-event.recorded`, pero su `POST /api/v1/time-events` no solicita por sí mismo el recálculo de S5.

## Decisiones vinculantes

- Las rutas privadas se protegen en servidor. La UI, los enlaces y la ocultación de datos nunca sustituyen a la autorización de API.
- Sin sesión válida, `/`, `/employee/**` y `/admin/**` redirigen a `/login` con un retorno interno validado; no se aceptan destinos externos ni esquemas distintos.
- Con sesión válida, `/` redirige a `/employee`. La autorización de cada API continúa respondiendo `401`/`403`; no se transforman las APIs en redirecciones HTML.
- El kiosco físico con PIN es la única excepción pública: sólo `/kiosk?publicKioskId={id-opaco}` puede mostrar la pantalla de PIN. `/kiosk` sin identificador redirige a `/login` y no expone datos de centro, persona ni sesiones.
- El modo QR conserva su contrato actual: el desafío es opaco y temporal, pero el fichaje QR requiere sesión de empleado válida. Convertir QR en fichaje público queda fuera de S19 y requiere una decisión nueva de seguridad.
- Los eventos originales, correcciones aditivas, idempotencia, auditoría, zonas IANA y reglas S3/S5 no se reescriben. Una lectura `GET` nunca materializa ni recalcula una jornada.
- No se introducen GPS, biometría, fotografía, cámara, vigilancia, nómina, interpretación de convenio ni datos reales.

## Alcance autorizado

### Navegación y sesión

- Guardia de servidor para las páginas privadas y pruebas de redirección de `/`, `/employee/**` y `/admin/**`.
- Manejo seguro de `returnTo`: sólo rutas internas incluidas en una lista permitida; tras login correcto se vuelve a esa ruta o a `/employee`.
- Ruta raíz como entrada controlada, sin renderizar el componente de fichaje anónimo.
- Kiosco: validación sintáctica temprana de `publicKioskId`, pantalla pública mínima sin identidad y respuesta neutra o redirección si falta/no es válido. Las APIs de PIN conservan la validación criptográfica y de expiración de S4.

### Historial y cálculo

- Diferenciar en el detalle de jornada: cálculo materializado disponible; eventos existentes pendientes de cálculo; ausencia de eventos; `401`/`403`; y fallo técnico recuperable. No ocultar todos los errores bajo un único aviso.
- Añadir un contrato explícito de S4→S5 para que un evento confirmado solicite un recálculo idempotente de su fecha laboral mediante el `domain_event_outbox`, sin impedir ni revertir el fichaje ya confirmado si el consumidor debe reintentarse.
- Definir un consumidor/reintento de outbox dentro del monolito y una operación de reparación auditable para evidencia histórica anterior al consumidor. La reparación queda limitada al entorno y ámbito autorizados; no puede inventar eventos, minutos, pausas ni datos de calendario.
- El empleado sólo lee su resultado ya materializado. La ejecución operativa y la reparación no se exponen como un botón de recálculo libre para empleado.

## Exclusiones

- Rediseñar los flujos de fichaje, la máquina de estados, PIN/QR, MFA, RBAC de API, reglas de jornada o algoritmo de cálculo.
- Convertir el QR en un mecanismo público o añadir hardware, cámara o lectores nuevos.
- Crear un dashboard de kioscos, configuración UI de kiosco o una cola/servicio externo. S16/S12 serán propietarias de cualquier ampliación operativa visible o de despliegue.
- Migrar o modificar eventos/correcciones existentes. Si se requieren tablas para el cursor/reintento de outbox, la migración debe ser aditiva y propiedad explícita de S19.

## Dependencias y propietarios

| Dependencia | Uso en S19 | Límite |
|---|---|---|
| S1 | sesiones, `currentActor`, cookie y RBAC | La guardia sólo consulta la sesión; no cambia criptografía, MFA ni permisos. |
| S4 | rutas privadas de fichaje, kiosco y `time-event.recorded` | No cambia la secuencia ni evidencia; el contrato de consumo se acuerda de forma aditiva. |
| S5 | recálculo/versionado y lectura de `daily_calculations` | Sólo consume un comando/contrato público idempotente; no duplica el algoritmo. |
| S7/S14 | historial, mensajes y foco accesible | No altera reglas de negocio ni añade métricas laborales. |
| S11/S12/S13 | fixtures sintéticos, E2E y operación Docker | Sin datos reales; el consumidor debe ser observable sin secretos. |
| S15 | cierre operativo y seguridad perimetral | S19 no elimina el NO-GO ni sustituye TLS/WAF, backups o aprobaciones. |

Antes de implementar el consumidor se requiere una enmienda conjunta S4/S5 que publique: carga mínima del evento, clave de deduplicación, responsabilidad de reintento, actor/auditoría de la materialización y estrategia de reproceso histórico. Si no se aprueba, S19 puede entregar navegación protegida y mensajes diferenciados, pero no declarar resuelta la disponibilidad de cálculo histórico.

## Módulos, rutas y documentación autorizados

- Guardía de Next.js y rutas de página bajo `src/app/{page.tsx,employee/**,admin/**,kiosk/**}`; se preferirá una única frontera de servidor antes de duplicar comprobaciones cliente.
- `src/auth/*` sólo para un adaptador público de lectura de sesión si es imprescindible para la guardia.
- `src/time-events/*`, `src/time-calculation/*` y migración nueva `migrations/s019_*` únicamente tras la enmienda S4/S5 anterior.
- `src/employee/{api,components,presentation}.ts`, `src/ui/*` y pruebas de presentación para mensajes de historial.
- `tests/auth-navigation*.test.ts`, `tests/time-calculation*.test.ts`, `tests/employee-*.test.ts` y E2E sintética nueva bajo patrones S11/S13.
- Este contrato, `docs/mvp/README.md`, guía de usuario, documentación técnica del consumidor y guía de operación si se introduce reintento.

No autoriza cambios en S2/S3/S6/S8/S9/S10/S15/S16 ni rutas de administración no listadas.

## Riesgos y mitigaciones

| Riesgo | Mitigación obligatoria |
|---|---|
| Redirección abierta o bucle de login | Lista permitida de retornos internos; pruebas de URL absoluta, `//host`, API y login. |
| Bloquear un kiosco válido | Excepción estrecha por `publicKioskId`; PIN y sesión de kiosco se validan siempre en servidor. |
| Exponer estructura o datos antes de autorizar | Guardia de servidor; APIs mantienen 401/403 y pruebas sin cookie. |
| Fichaje confirmado sin cálculo inmediato | Outbox deduplicado, reintento y mensaje honesto; el evento no se revierte ni se recalcula desde GET. |
| Duplicar o alterar cálculo histórico | Consumir contrato S5 público, clave idempotente, versiones inmutables y prueba de reproceso. |
| Añadir datos o telemetría innecesarios | Fixtures sintéticos; logs sin PIN, tokens, cookies, contraseñas ni contenido laboral superfluo. |

## Criterios de aceptación

- Una petición anónima a `/`, `/employee`, historial, correcciones y `/admin/**` recibe una redirección al login; una sesión revocada se comporta igual.
- Una sesión válida entra por `/` en `/employee`; un `returnTo` interno permitido se conserva tras login, y un destino externo se descarta.
- Las APIs continúan devolviendo 401/403 y validando autorización en servidor, incluso si se accede por URL directa.
- `/kiosk?publicKioskId=` conserva el flujo PIN público sin revelar identidad; `/kiosk` sin identificador no entrega una pantalla operativa anónima; QR no pierde su requisito de sesión.
- El historial no afirma que el cálculo “no está disponible” ante autorización, ausencia de eventos o error interno: cada caso usa copy y acción de recuperación coherentes.
- Tras un evento o corrección confirmados, el cálculo de su fecha laboral se materializa de forma idempotente mediante el mecanismo aprobado; el reproceso no crea ni reescribe evidencia y conserva DST, medianoche, jornada nocturna y correcciones aprobadas.
- La reparación histórica queda auditada, limitada al ámbito y no expone una mutación directa a empleado.
- Todas las pruebas usan office/multisite sintéticos; no hay PII, PIN, secretos o tokens en respuestas/logs.

## Pruebas obligatorias

- Unitarias de normalización/allowlist de retorno y mensajes de historial.
- Integración HTTP y de página: anónimo, cookie malformada/revocada, employee, manager, admin y rutas profundas; APIs directas 401/403.
- E2E browser: raíz, login, retorno seguro, logout, navegación de empleado/admin y kiosco PIN/QR con viewports S14 y teclado.
- Integración PostgreSQL: evento, pausa, salida, corrección aprobada, reproceso, duplicado, día histórico, madrugada, medianoche y DST; verificar versiones/materialización e inmutabilidad de fuente.
- Aislamiento: cookie office contra multisite, `publicKioskId` de otro entorno y reparación fuera de ámbito denegados.
- Operación: reinicio del consumidor, reintento idempotente, logs sintéticos y health/observabilidad sin secretos.

## Plan de implementación y cierre

1. Validar y publicar la enmienda S4/S5 para el contrato de outbox antes de tocar cálculo o migraciones.
2. Implementar guardia de páginas, entrada raíz y excepción de kiosco; cubrir primero redirección, retorno seguro y RBAC.
3. Implementar mensajes de historial diferenciados sin mutar en GET.
4. Implementar consumidor/reintento y reparación histórica sólo tras el contrato aprobado; ejecutar pruebas SQL/E2E y revisión de logs.
5. Actualizar guía, README y operación; realizar commit verificable, publicar la rama y abrir revisión contra `master`.

## Estado de apertura

- **Confirmado:** navegación privada no protegida a nivel de página; APIs protegidas en servidor.
- **Confirmado:** `/` no es una entrada controlada.
- **Confirmado:** el detalle de historial colapsa todos los errores de cálculo en un único mensaje y puede existir evidencia sin proyección materializada.
- **Aprobado por producto para este contrato:** kiosco PIN público sólo con `publicKioskId`; resto de rutas privadas redirigen a login; QR continúa autenticado.
- **Bloqueo de implementación parcial:** falta enmienda S4/S5 para el consumidor de outbox y la reparación histórica. No se implementará ese bloque hasta contar con ella.

## Implementación parcial — 12/09/2026

### Alcance completado

- Las páginas `/`, `/employee`, `/employee/history`, `/employee/history/[laborDate]`, `/employee/corrections`, `/admin`, `/admin/people`, `/admin/corrections` y `/admin/corrections/[id]` consultan la sesión en servidor antes de renderizar su UI. Cookie ausente, malformada, revocada o expirada redirige a `/login`.
- `src/auth/return-to.ts` sólo acepta retornos internos de las familias `/employee` y `/admin`; rechaza URLs absolutas, `//host`, barras inversas, APIs, login, kiosco y otras rutas. El login reutiliza la misma normalización al finalizar contraseña o MFA y usa `/employee` como destino seguro por defecto.
- `/` ya no carga un fichaje anónimo: con sesión válida redirige a `/employee`; sin ella, a login. Las APIs no se modificaron y continúan respondiendo JSON `401`/`403`.
- Sólo `/kiosk?publicKioskId={uuid-opaco}` renderiza el PIN público mínimo. `/kiosk` y un ID sintácticamente inválido redirigen a login; la pantalla no recibe ni muestra centro, persona o sesión. QR deja de convertir la página pública de kiosco en fichaje web y conserva su API autenticada de S4.
- El detalle de historial distingue cálculo materializado, registros pendientes de materialización (`404` con eventos), ausencia de eventos, `401`/`403` y fallo técnico recuperable. La lectura no inserta, recalcula ni repara jornada alguna.

### Archivos afectados

- Guardias y navegación: `src/auth/{page-guard,return-to,ui}.ts(x)` y las páginas autorizadas de `src/app/{page,employee/**,admin/**,login/**,kiosk/**}`.
- Presentación: `src/employee/{api,components,presentation}.ts` y `src/time-events/kiosk-ui.tsx`.
- Pruebas: `tests/auth-navigation.test.ts`, `tests/employee-presentation.test.ts`; se mantuvo la regresión de `tests/employee-api.test.ts`.
- Documentación: este contrato, `README.md` del MVP y guía de usuario.

### Pruebas y resultados reales

- `npx tsc --noEmit`: correcto en host; el host conserva Node 18 y no puede iniciar Vitest por ausencia de `node:fs.statfsSync`.
- `docker compose --env-file .s13.synthetic.env build app`: correcto con Node 20; permanecen cuatro advertencias conocidas de Turbopack en `src/exports/service.ts`, fuera de S19.
- `docker compose --env-file .s13.synthetic.env run --rm --no-deps app npm test`: **96 pruebas correctas en 28 ficheros**.
- Entorno Docker aislado `time-control-s19`: `/`, rutas privadas y kiosco sin/ID inválido devolvieron `307`; una ruta profunda redirigió a `/login?returnTo=%2Femployee%2Fhistory%2F2026-01-12`; `GET /api/v1/time-events` sin sesión devolvió `401`; kiosco con UUID opaco devolvió `200` con PIN y sin identidad.
- No se ejecutó login autenticado ni aislamiento office/multisite en este entorno: el contenedor de esta configuración no recibió `DATABASE_URL`, `ENVIRONMENT_ID` ni `DEMO_PASSWORD` para el seeder. No se inventaron ni expusieron credenciales; queda como bloqueo de evidencia local, no como validación declarada.

### Bloqueos, riesgos y aprobación requerida

- Sigue obligatoria la enmienda conjunta S4/S5 antes de modificar `time-events`, `time-calculation`, `domain_event_outbox`, migraciones o implementar consumidor, reintento y reparación histórica. Debe definir carga mínima, deduplicación, reintento, actor/auditoría y reproceso. **Aprobación requerida del propietario S4/S5.**
- No se añadieron migraciones, cambios de evidencia, recálculo por `GET`, reparación libre para empleado, telemetría, datos reales ni capacidades excluidas. S15 y el NO-GO para datos reales permanecen sin cambios.
