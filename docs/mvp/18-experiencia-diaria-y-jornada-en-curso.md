# S18 — Experiencia diaria y jornada en curso informativa

**Estado:** contrato aprobado; pendiente de implementación. **Tamaño:** M. **Propietaria:** S18 para la proyección read-only, su ruta, presentación acotada y pruebas. **Dependencias:** S4, S5, S7, S11, S14 y la decisión S17 `ef1e8c3` (hasta que se integre en `master`). **Relación con piloto:** se ejecuta antes de S15 y S16, pero no elimina el NO-GO de S15 ni habilita datos reales.

## Objetivo

Hacer inequívoco para la persona empleada si su jornada está sin iniciar, activa, en pausa o finalizada, y mostrar el tiempo efectivo acumulado **sólo como información de registro** durante una jornada activa. Reducir dudas cotidianas sin convertir el producto en monitorización, nómina, control de productividad ni interpretación de convenio.

## Alcance

- Nueva proyección temporal read-only de servidor para la propia persona empleada, con `asOf` UTC, estado textual y tiempo efectivo acumulado informativo.
- El valor avanza únicamente cuando la secuencia confirmada está activa; se congela en pausa o salida. Se vuelve a consultar tras fichar, recargar y recuperar foco, y se refresca periódicamente desde servidor mientras la jornada está activa. El navegador no calcula ni persiste la cifra.
- Presentación acotada en `/employee`: estado textual, última confirmación, tiempo acumulado, acción disponible y texto explícito de carácter no salarial/no disciplinario.
- Ayuda contextual mínima para estado, pausa manual, error recuperable y desconexión. No solicita ni almacena texto libre, credenciales, PIN, secretos ni información laboral adicional.
- Reutilización de eventos confirmados, correcciones aditivas y semántica temporal de S4/S5 mediante contratos públicos/adaptadores. La proyección no persiste un total nuevo ni altera la evidencia, cálculo histórico, auditoría o reglas.

## Exclusiones

No incorpora calendario o planificación, recordatorios, notificaciones, chatbot, telemetría de productividad, analítica de comportamiento, geolocalización, GPS, biometría, cámara, foto, vídeo, vigilancia, fichaje automático, app nativa, offline completo, nómina, horas extra legales, convenios, cambios de turno, ausencias, cierre de período ni reapertura de correcciones.

No se modifican tablas, migraciones, eventos originales, efectos de corrección, permisos existentes, políticas de cálculo, API de fichaje ni rutas administrativas. Si la fuente pública de S5 no permite incluir el efecto de una corrección aprobada sin reimplementar su algoritmo, S18 se detiene y propone una enmienda de contrato a S5; no lee internals ajenos ni duplica cálculos.

## Contrato de integración

### API nueva y autorización

`GET /api/v1/workday-status/me`

- Requiere sesión y permiso propio de lectura de jornada; el actor, empleo, tenant, centro y zona se resuelven en servidor. No acepta `employeeId`, `companyId`, `siteId`, zona ni `asOf` desde cliente.
- Devuelve sólo la proyección de la persona autenticada: `asOf` UTC emitido por servidor, `laborDate`, `effectiveTimeZone`, `status` (`not_started`, `working`, `on_break`, `ended`), `effectiveMinutes`, `lastConfirmedAt` y acción válida siguiente si existe.
- `effectiveMinutes` es `null` sin evidencia suficiente y nunca representa nómina, sanción, productividad, cumplimiento ni derecho económico. La respuesta no expone eventos de terceros, secretos, PIN, datos de dispositivo ni PII adicional.
- En estado `working`, cada respuesta se calcula desde evidencia confirmada y el `asOf` del servidor. En pausa o salida, el acumulado se conserva hasta una nueva secuencia válida. El cliente vuelve a solicitar la proyección; no deriva minutos a partir de su reloj.
- La ruta es de lectura: no inserta, actualiza ni borra eventos, cálculos, auditoría, correcciones ni idempotencias. La autorización y el aislamiento se prueban en servidor, incluso mediante llamada directa a la URL.

### Fuentes y semántica

S18 consume la secuencia efectiva y autorizada que expongan S4/S5, incluida la semántica de correcciones aditivas de S6 cuando forme parte de la proyección de cálculo. Respeta UTC para duración, zona IANA para fecha laboral/presentación, turnos que cruzan medianoche y ambos cambios DST. Una pausa abierta no genera tiempo efectivo; un evento incompleto conserva su incidencia sin inventar datos; una corrección pendiente no cambia el estado hasta que el contrato existente la haga efectiva.

## Archivos, rutas y módulos autorizados

S18 puede crear:

- `src/workday-status/contracts.ts`, `service.ts`, `http.ts` y `presentation.tsx` como módulo nuevo y adaptador read-only.
- `src/app/api/v1/workday-status/me/route.ts`.
- `tests/workday-status.test.ts`, `tests/workday-status-http.test.ts` y casos sintéticos necesarios bajo los patrones de S11.

S18 puede modificar de manera mínima y documentada:

- `src/employee/api.ts` y `src/employee/components.tsx`, sólo para consultar y presentar la proyección en `/employee` sin cambiar el fichaje ni sus claves de idempotencia.
- `src/app/globals.css` y `src/ui/feedback.tsx`, sólo para la presentación accesible ya definida por S14.
- Este contrato, `docs/mvp/README.md`, `docs/guia-usuario-piloto.md`, `docs/mvp/informe-preparacion-piloto.md` y la documentación técnica de la ruta si se crea.

No autoriza cambios en `src/time-events/*`, `src/time-calculation/*`, `src/corrections/*`, tablas, migraciones, rutas de administración ni contratos de S4–S6. Cualquier necesidad fuera de esta lista requiere enmienda aprobada de la sesión propietaria.

## Estrategia de implementación

1. Definir tipos y una interfaz de fuente efectiva que consuma contratos públicos de S4/S5; validar primero que incluye efectos de corrección sin duplicar algoritmo.
2. Implementar servicio y ruta read-only, con autorización de servidor y respuestas mínimas.
3. Añadir pruebas de unidad/HTTP antes de la presentación.
4. Integrar el bloque informativo en `/employee` y refrescar desde servidor tras fichaje, recarga, retorno de foco y a intervalo visible mientras esté `working`.
5. Ejecutar regresión S4–S7/S11 y revisión responsive/accesible. Si la fuente efectiva no está disponible, detenerse antes de UI y documentar el bloqueo.

## Riesgos y mitigaciones

| Riesgo | Mitigación obligatoria |
|---|---|
| Divergencia frente al cálculo histórico o correcciones aditivas | Consumir una fuente efectiva pública; no duplicar algoritmo ni persistir acumulado. |
| DST, medianoche o jornada nocturna incorrectos | Duraciones en UTC, fecha/presentación con zona IANA y casos de S11. |
| Presentar control laboral, salario o productividad | Copy informativo fijo, sin objetivos, rankings, alertas ni métricas de rendimiento. |
| Acceso entre personas o clientes | Actor y ámbito resueltos sólo en servidor; pruebas de URL/API directas, RBAC y entorno dedicado. |
| PII o secretos en logs/ayuda | Respuesta mínima, errores seguros y revisión de logs con fixtures sintéticos. |
| Regresión de fichaje | No cambiar POST de eventos, secuencia ni idempotencia; recargar proyección sólo tras confirmación existente. |

## Criterios de aceptación

- La persona autenticada ve un estado textual correcto y un acumulado informativo sólo de su propia jornada; otro rol/tenant no puede consultar el recurso por URL/API.
- La cifra avanza únicamente en `working`, se congela en pausa/salida y se corrige al volver a consultar; el navegador no calcula, almacena ni envía tiempos.
- Entrada, pausa, fin de pausa, salida, jornada incompleta, corrección pendiente/aprobada, jornada nocturna, medianoche y DST conservan la semántica S4/S5.
- No hay tablas, migraciones, eventos, correcciones, cálculos persistidos, auditoría, reglas ni permisos nuevos o alterados.
- La UI es responsive a 320, 390, 768 y 1280 px; incluye foco visible, texto no dependiente de color, estados de carga/error anunciables y no bloquea el fichaje existente.
- Las pruebas usan exclusivamente fixtures sintéticos S11, cubren autorización, aislamiento de cliente, ausencia de PII innecesaria en logs y regresiones S4–S7.
- La guía comunica el carácter informativo y los límites; el informe conserva el NO-GO de S15.

## Pruebas requeridas

- Unitarias del proyector: secuencias, pausa, salida, incompletos, correcciones efectivas, UTC, zona IANA, medianoche y DST.
- Integración HTTP: sesión propia positiva; ausencia de sesión; intento con parámetros de ámbito ignorados/rechazados; actor de otro ámbito/entorno denegado; respuesta sin campos sensibles.
- Regresión de S4–S7 y S11 con `office` y `multisite` sintéticos, incluyendo idempotencia existente de fichaje.
- Presentación: carga, error, refresco tras fichaje/foco, teclado, árbol accesible, contraste y los cuatro viewports S14.
- Revisión de logs y errores con fixture sintético para confirmar que no aparecen contraseña, secreto MFA, PIN, token ni contenido laboral innecesario.

## Decisiones ya aprobadas y pendientes

- **Aprobado:** priorizar S18 antes de S15/S16 con el alcance y exclusiones anteriores.
- **Sin cambiar:** S15 es obligatorio antes de datos reales; S16 continúa como trabajo prepiloto posterior a S15; no hay piloto con datos reales ni promesa de cumplimiento automático.
- **Pendiente antes de editar código:** confirmar que el adaptador público de S5 puede ofrecer la secuencia efectiva con correcciones sin modificar su contrato. Si no, se requiere una enmienda explícita de S5 antes de implementar S18.
