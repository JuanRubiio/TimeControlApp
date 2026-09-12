# S18 — Experiencia diaria y jornada en curso informativa

**Estado:** implementación parcial; fundación S5 consumida y ruta/UI entregadas, pendientes pruebas HTTP/E2E visuales requeridas. **Tamaño:** M. **Propietaria:** S18 para la proyección read-only, su ruta, presentación acotada y pruebas. **Dependencias:** S4, S5, S7, S11, S14 y la decisión S17 `ef1e8c3` (integrada en `master` mediante `dc338f2`). **Relación con piloto:** se ejecuta antes de S15 y S16, pero no elimina el NO-GO de S15 ni habilita datos reales.

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

## Registro de apertura y bloqueo — 11/09/2026

### Comprobaciones realizadas

- Se confirmó un único contrato S18 y se revisaron S4, S5, S7, S11, S13, S14, S17, la evaluación prepiloto, el informe de piloto y el workflow Git.
- `master` remoto contiene la aprobación equivalente a la decisión S17 `ef1e8c3` mediante `dc338f2` y el contrato S18 mediante `0ee5e53`. La rama `codex/s18-experiencia-jornada` se alineó con esa base. Los ficheros sin seguimiento `.s13.synthetic.env` y `.s13.multisite.env` se preservaron sin incluirlos en el trabajo.
- La regresión base se ejecutó con fixtures sintéticos: `docker compose --env-file .s13.synthetic.env run --rm --no-deps app npm test` terminó con código 0.

### Bloqueo contractual

S5 publica en `src/time-calculation/contracts.ts` únicamente resultados materializados (`PersistedDailyCalculation`) y tipos de cálculo. La secuencia efectiva que excluye eventos sustituidos e incorpora `correction_effects` se construye internamente en `recalculateDaily` de `src/time-calculation/service.ts`; no existe un contrato público read-only que S18 pueda consumir para obtener esa evidencia, ni para proyectar el tramo `working` con el `asOf` emitido por el servidor.

Usar directamente esas consultas internas, leer `correction_effects` desde S18 o reproducir la selección/cálculo infringiría las exclusiones de esta sesión y podría divergir de S5. Por ello no se han creado la ruta, módulo, presentación, pruebas, tablas ni migraciones de S18; tampoco se ha modificado el fichaje, cálculo, correcciones, permisos o auditoría existentes.

### Enmienda propuesta a S5 — aprobación requerida

La sesión propietaria S5 debe aprobar un contrato público read-only, por ejemplo un adaptador `EffectiveWorkdaySource`, que para un empleo y fecha laboral ya autorizados devuelva la secuencia efectiva ordenada y mínima: eventos confirmados originales no sustituidos, efectos de corrección aprobados, zona IANA, fecha laboral y el estado de evidencia incompleta. El adaptador debe:

- conservar la selección de fuentes y la semántica de S5, incluidos correcciones aprobadas, medianoche y DST;
- no materializar ni mutar cálculos, eventos, correcciones, auditoría o idempotencias;
- no exponer motivos de corrección, PIN, secretos, datos de dispositivo ni datos de terceros; y
- tener pruebas de contrato con las secuencias S11 antes de que S18 la consuma.

Tras una enmienda aprobada e integrada en `master`, S18 podrá retomar su API propia, autorización servidor, presentación y pruebas requeridas. Hasta entonces mantiene el NO-GO de S15 y no declara criterios funcionales completados.

## Implementación tras enmienda S5 — 11/09/2026

La enmienda S5 se publicó separadamente en `f28707f` (`codex/s5-effective-workday-source`) y se consumió mediante merge verificable en esta rama. Publica `EffectiveWorkday` y `effectiveWorkday(employeeId, asOf)` como fuente read-only: selecciona la misma evidencia efectiva usada por S5, excluye eventos sustituidos y añade efectos aprobados, sin exponer motivos, PIN, dispositivo ni terceros.

S18 añade `src/workday-status/{contracts,service,http}.ts` y `GET /api/v1/workday-status/me`. La ruta no recibe empleado, empresa, centro, zona ni instante del cliente; resuelve la sesión, aplica `time-event.read:self`, identifica el empleo propio y obtiene `asOf` de `clock_timestamp()` en PostgreSQL. No inserta, actualiza ni borra evidencia, cálculo, correcciones, auditoría o idempotencias.

La presentación de `/employee` consume sólo esa respuesta: estado textual, última confirmación, acumulado de registro y límites no salariales/no disciplinarios. La cifra se proyecta con el `asOf` del servidor, avanza únicamente con `working` y se congela en pausa/salida. Se vuelve a consultar tras el fichaje confirmado, foco y cada minuto mientras trabaja; no se persiste ni deriva del reloj del navegador.

### Pruebas y pendientes reales

- Correctas en Docker con `.s13.synthetic.env`: `npx tsc --noEmit`, `npm test` y `npm run build` (código 0).
- `tests/workday-status.test.ts` cubre trabajo en curso, pausa, salida, ausencia de evidencia y una duración UTC que atraviesa DST.
- Pendientes antes de declarar S18 completa: integración HTTP autenticada/negativa directa para la nueva ruta (sesión, RBAC, aislamiento y parámetros de ámbito), ejercicio con los perfiles `office` y `multisite`, inspección de logs sintéticos, y recorrido visual/manual S14 de teclado, árbol accesible, contraste y viewports 320/390/768/1280. No se han presentado estos puntos como verificados.

### Repetición E2E local — 12/09/2026

En el proyecto Docker aislado `time-control-s18-retest`, con perfil `office` exclusivamente sintético, se verificó health de aplicación y PostgreSQL, migración, seed y los siguientes asertos HTTP: `GET /api/v1/workday-status/me` sin sesión devuelve `401`; tras login de empleado demo devuelve `200`; y los parámetros de cliente `employeeId` y `asOf` no cambian el ámbito resuelto en servidor ni impiden la respuesta propia. La suite del contenedor finalizó con **79 pruebas en 26 ficheros correctos**. PostgreSQL se comprobó accesible en el puerto host configurado para la inspección local con DBeaver.

La fuente S5 ya corrige una jornada nocturna abierta tras medianoche: consulta la fecha laboral anterior sólo cuando sigue abierta y no reabre una jornada ya terminada. La prueba unitaria de S5 lo cubre. También se revisaron los últimos 100 logs del contenedor sintético sin coincidencias de contraseña, secreto, token, cookie, pepper o URL de base de datos.

Pendiente antes del cierre: prueba negativa entre `office` y `multisite` y recorrido visual accesible de teclado, árbol, contraste y viewports 320/390/768/1280.

### Cierre parcial de validación — 12/09/2026

- Se repitió la comprobación aislada con dos entornos sintéticos en contenedores distintos: la cookie de `office` obtuvo `200` sólo en su aplicación (`http://127.0.0.1:3017`) y recibió `401` al intentar consumir el recurso en `multisite` (`http://127.0.0.1:3018`). Se confirma que una sesión no cruza el entorno dedicado por cliente.
- Se añadió `tests/workday-status-http.test.ts`, que comprueba el sobre mínimo de éxito, correlación y que los errores `401`, `403` y `500` no reflejan detalles internos. La cobertura de presentación incluye también la advertencia para una secuencia histórica abierta que no corresponde a la jornada de hoy.
- En un navegador local se verificaron árbol accesible, carga y estado cargado, etiqueta textual independiente de color, aviso contextual visible y refresco tras un fichaje sintético. La acción `Registrar salida` confirmó el resultado, actualizó el estado a `Finalizada`, la última confirmación y dejó una única siguiente acción (`Registrar entrada`). El recorrido conserva texto de ayuda y controles nativos enfocables.
- No se pudieron ejecutar de nuevo las pruebas recién añadidas ni realizar la comprobación instrumental de los cuatro anchos (`320`, `390`, `768`, `1280`) porque el host devolvió `Espacio en disco insuficiente (os error 112)` al crear incluso el proceso de prueba. Se intentó liberar sólo imágenes colgantes, caché de construcción y contenedores detenidos de Docker, preservando los dos contenedores en ejecución y sus volúmenes para la conexión de DBeaver; el error persistió. No se ha eliminado ningún volumen ni datos sintéticos activos.

**Bloqueo de cierre:** recuperar espacio en el host y repetir `npm test -- --run tests/workday-status.test.ts tests/workday-status-http.test.ts tests/employee-presentation.test.ts`, la suite Docker completa y la revisión visual en los cuatro viewports. Hasta entonces S18 permanece **parcialmente completada** y no se afirma la ausencia total de defectos.

### Actualización de cierre — 12/09/2026

- La comprobación responsive pendiente se completó en navegador con `320`, `390`, `768` y `1280` px. En los cuatro anchos el contenido no desbordó horizontalmente, los controles permanecieron visibles y el foco del enlace de navegación se expuso con contorno sólido. El árbol accesible conserva encabezados, lista de definiciones para el resumen y controles nativos enfocables.
- El recorrido sintético de empleado terminó en `Finalizada` tras confirmar una salida: muestra estado textual, última confirmación y solamente `Registrar entrada` como siguiente acción. La consola del navegador no registró advertencias ni errores. Para el caso de una entrada histórica aún abierta, la presentación añade un aviso que separa explícitamente esa evidencia de la jornada actual, cubierto por prueba unitaria.
- `npm exec tsc -- --noEmit` finalizó correctamente con los cambios de cierre. El runner Vitest del host no puede ejecutarse porque usa Node `18.12.1` y esta versión de Vitest requiere `node:fs.statfsSync`; el runner correcto es el contenedor con Node soportado. Desde esta sesión, el acceso al socket de Docker fue denegado por el entorno de ejecución, por lo que no fue posible repetir la nueva prueba HTTP ni la suite completa dentro del contenedor.

**Estado al cierre local:** la implementación y las validaciones HTTP/E2E previas están completadas; queda bloqueada únicamente la repetición de Vitest en Docker para la prueba nueva de sobre HTTP y la regresión completa. No hay P0 confirmado; el bloqueo de infraestructura se registra como P2 de validación. S15 mantiene sin cambios el NO-GO para datos reales.

### Cierre final — 12/09/2026

- Docker Desktop se recuperó y se reconstruyó el entorno dedicado sintético `time-control-s18-retest`. La aplicación quedó saludable en `127.0.0.1:3013` y PostgreSQL en `127.0.0.1:5432`; se conserva levantado para la conexión local con DBeaver. Se limpió únicamente la caché de construcción y las imágenes colgantes antes de la reconstrucción; no se eliminaron volúmenes.
- La compilación Docker completó correctamente. Conserva cuatro advertencias conocidas de Turbopack sobre acceso dinámico a archivos en `src/exports/service.ts`, fuera del alcance de S18 y ya registradas como riesgo previo de empaquetado; no son un defecto introducido por esta sesión.
- `npm test` dentro del contenedor finalizó con **83 pruebas correctas en 27 ficheros**, incluidas `workday-status.test.ts`, `workday-status-http.test.ts`, `employee-presentation.test.ts`, la corrección nocturna de S5 y las regresiones transversales S4–S7/S11.
- E2E HTTP con datos exclusivamente sintéticos: sin sesión `401`; login de empleado `200`; consulta propia `200`; `employeeId` y `asOf` enviados por cliente no alteran el ámbito del servidor. La respuesta contiene solamente `asOf`, `laborDate`, `effectiveTimeZone`, `status`, `effectiveMinutes`, `lastConfirmedAt` y `nextAction`.
- E2E de entorno dedicado: la misma sesión sintética obtuvo `200` en `office` y `401` en el entorno aislado `multisite`. El entorno temporal multisite se desmontó con `down --remove-orphans`, preservando los volúmenes. La revisión de los últimos 100 logs sintéticos no encontró coincidencias de contraseña, secreto, token, cookie, pepper ni URL de base de datos.

**S18 finalizada.** No hay defectos P0–P3 introducidos o confirmados por S18. S15 continúa siendo la puerta obligatoria y el NO-GO para datos reales no cambia.
