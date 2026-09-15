# S23 — Mi jornada planificada, sólo lectura

**Estado:** implementación sintética de ruta y presentación completada; validada manualmente en navegador con datos demo. No autoriza datos reales. **Historia:** HU-TC-024 / #45. **Tamaño:** M. **Propietaria:** S23 para su proyección read-only, ruta, presentación y pruebas. **Dependencias:** S3, S11, S14, S20 y revisión laboral si el copy o los datos cambian su interpretación.

## Objetivo

Como persona empleada, quiero consultar mi jornada publicada y compararla con los registros ya confirmados para entender una discrepancia y acceder al canal de corrección existente, sin que la aplicación planifique, ordene trabajo ni interprete derechos laborales.

La diferenciación es claridad individual: **previsto, registrado y qué hacer si no coinciden**. No mide productividad ni genera consecuencias automáticas.

## Alcance de diseño

- Una vista propia y responsive de una fecha laboral, inicialmente hoy y una fecha elegida dentro de un rango acotado que defina PO. Muestra jornada/turno y calendario ya publicados por S3, su vigencia, zona IANA y la fecha laboral resultante.
- Un resumen distinguible de `previsto` y `registrado`: estado de evidencia confirmada, incidencia o ausencia de registro. Sólo consume proyecciones autorizadas de S3/S4/S5/S6; no recalcula duración ni modifica la evidencia.
- Copy fijo: información operativa, no nómina, no interpretación de convenio, no orden de disponibilidad, ni decisión disciplinaria. Las discrepancias explican la fuente y ofrecen el flujo de corrección ya permitido; no sugieren que una persona tenga que fichar o trabajar.
- Estados de carga, sin turno/calendario publicado, regla sin vigencia, evidencia incompleta, fecha no disponible y error recuperable. Nunca se sustituye un vacío por una jornada inventada.
- Diseño y pruebas exclusivamente con fixtures sintéticos de S11. No se activan notificaciones, telemetría de uso ni nueva recogida de datos.

## Exclusiones

No incluye creación o edición de calendarios, cambios/solicitudes de turno, disponibilidad, preferencias, cobertura, optimización, asignación automática, turnos rotativos complejos, ausencias, recordatorios, notificaciones, nómina, bolsa de horas, horas extra legales, convenios, scoring, IA, geolocalización, vigilancia, exportación ni acceso a información de terceras personas.

S23 tampoco crea tablas, migraciones, eventos, cálculos, permisos, auditoría ni reglas. La interfaz nunca decide si existe una obligación, incumplimiento, saldo o consecuencia laboral.

## Contrato de integración propuesto

Antes de código, S3/S4/S5/S6 deben confirmar una fuente pública read-only que, a partir de actor autenticado y fecha resuelta por servidor, entregue únicamente:

- `laborDate`, `effectiveTimeZone`, identificador y vigencia de la regla publicada;
- tramo(s) de turno y calendario aplicables, con indicación explícita cuando no exista fuente publicada;
- resumen mínimo de evidencia propia confirmada o incidencia; y
- enlace/capacidad de corrección ya autorizada, sin exponer motivos, PIN, dispositivos, datos de terceros ni internals de cálculo.

La futura ruta no aceptará `employeeId`, tenant, centro, zona, versión de regla ni datos de turno desde navegador. El servidor resuelve actor, empleo, ámbito y fecha con los contratos propietarios. Si ninguna fuente pública permite el resumen sin duplicar reglas o cálculos, se detiene y se solicita enmienda a la sesión propietaria.

## Criterios de aceptación para pasar a desarrollo

1. La persona autenticada sólo puede consultar su propia información publicada; llamadas directas o manipuladas no cruzan empleo, centro ni entorno dedicado.
2. Cada dato previsto identifica regla/calendario/turno y vigencia, y diferencia inequívocamente información publicada de registro confirmado.
3. Sin regla, vigencia, calendario, turno o evidencia suficiente, la vista lo comunica sin inferir horario, minutos ni obligación.
4. Las fechas, jornada nocturna, medianoche y DST respetan UTC para instantes y zona IANA para presentación, según S3/S5.
5. Una discrepancia ofrece únicamente la vía existente de corrección o ayuda; no altera eventos, cálculos, reglas, auditoría ni idempotencia.
6. El texto visible no contiene afirmaciones de cumplimiento, salario, horas extra, disponibilidad, rendimiento ni disciplina.
7. La presentación cumple teclado, foco, contraste, lector de pantalla, carga/error anunciables y 320/390/768/1280 px con fixtures sintéticos.
8. Pruebas unitarias, HTTP y de aislamiento cubren autorización, vigencias, vacío, incidencia, medianoche y DST; la regresión S3–S6/S11 es correcta.

## Implementación de ruta y presentación — 14/09/2026

- `GET /api/v1/published-workday/me` autentica la sesión, exige `time-event.read:self`, resuelve el empleado y `asOf` en servidor y llama al puerto S3/S5. No recibe parámetros de navegador y no realiza escrituras.
- `src/published-workday/{service,http}.ts` devuelve errores genéricos para sesión, autorización, ausencia de empleo y fallo técnico. El sobre HTTP conserva sólo `laborDate`, zona, horario publicado y estado mínimo de evidencia.
- `/employee` muestra «Jornada publicada» para hoy: turno, minutos esperados publicados, calendario y si existe evidencia registrada. Un vacío no infiere horario; una evidencia nocturna anterior se etiqueta como tal. El copy explica que no es orden de disponibilidad, nómina, convenio ni decisión disciplinaria, y enlaza sólo al flujo existente de correcciones.
- La presentación identifica además el nombre y tramos del turno, la vigencia, zona IANA y el estado de la fecha dentro del calendario publicado (laborable, no laborable o festivo). No habilita selector histórico mientras el PO no apruebe su rango; tampoco deriva una obligación de esos datos.
- Se mantienen excluidos selector histórico, edición, planificación, notificaciones, datos de terceros y cambios de eventos, cálculo, reglas, permisos o auditoría.

## Puertas y decisiones pendientes

- **PO:** confirma rango temporal inicial, vocabulario de discrepancia y si el enlace de corrección se muestra sólo cuando existe una capacidad ya autorizada.
- **S3/S4/S5/S6:** confirman la fuente pública mínima y su propiedad; ninguna sesión consumidora accede a tablas o internals ajenos.
- **UX/accesibilidad:** valida que `previsto` no parezca una instrucción, que el vacío sea comprensible y que no se dependa del color.
- **Asesoría laboral:** revisa el copy únicamente si se amplía el significado de los datos más allá de la información operativa publicada.
- **S15:** sigue siendo NO-GO para datos reales; S23 no lo adelanta ni modifica.

## Comprobación de contratos existente — 14/09/2026

La revisión del código confirma que S3 publica `ResolvedRule`, `CalendarSnapshot` y `ShiftSnapshot`; y S5 publica `EffectiveWorkday` mediante `effectiveWorkday(employeeId, asOf)`. Se añadió la enmienda `publishedWorkdayForEmployee(employeeId, asOf)` en S5: recibe sólo el empleo interno ya autorizado y un instante UTC de servidor, usa el contexto de empleo S2 para resolver ámbitos y zona, consulta la versión publicada de S3 y entrega calendario/turno/vigencia junto con un estado mínimo de evidencia efectiva.

El sobre `PublishedWorkday` no expone eventos, identificadores de ámbito, motivos de corrección, dispositivos ni internals de cálculo. No acepta ámbitos, versión, turno ni fecha local desde navegador y no realiza escrituras. `tests/published-workday.test.ts` cubre ausencia de evidencia, jornada efectiva nocturna que cruza fecha y empleo no vigente. La futura ruta S23 seguirá siendo responsable de autenticar y autorizar a la persona antes de invocar el puerto; la enmienda no autoriza todavía esa ruta ni una UI.

### Validación de la enmienda — 14/09/2026

- `npm test -- tests/published-workday.test.ts`: 3 pruebas correctas; `npx tsc --noEmit` y `git diff --check` correctos.
- En el proyecto Compose sintético aislado `time-control-s23-contract`, perfil `office`, health `200` y `npm test`: **116 pruebas correctas en 33 ficheros**.
- La imagen construyó correctamente. Persisten advertencias conocidas de Turbopack en los módulos de exportación y por `node:crypto` en el runtime Edge; no son introducidas por esta enmienda.
- Al terminar se ejecutó sólo `down --remove-orphans` sobre ese proyecto: se retiraron sus contenedores y red, se preservó su volumen sintético y no se limpió ningún recurso global ni ajeno.

### Validación de ruta y presentación — 14/09/2026

- `tests/published-workday.test.ts`, `tests/published-workday-http.test.ts` y `tests/employee-presentation.test.ts`: **9 pruebas correctas**; TypeScript y comprobación de diff correctos.
- En el mismo entorno Docker sintético, `GET /api/v1/published-workday/me` devuelve `401` sin sesión y `200` con la sesión demo propia; el sobre positivo no contiene `employeeId`, `scope` ni eventos.
- Build, health `200` y regresión Docker: **118 pruebas correctas en 34 ficheros**. Siguen las advertencias preexistentes de Turbopack ya documentadas; no se añade ninguna nueva.
- La revisión manual en navegador de los anchos S14 (320/390/768/1280) y del recorrido por teclado se completó el 14/09/2026. La comprobación con una tecnología asistiva real queda como validación específica de accesibilidad, fuera de esta E2E visual.

### Revisión manual E2E en navegador — 14/09/2026

Se utilizó una instancia local aislada de Chrome y la cuenta demo `night.office@demo.test`; no se consultaron ni modificaron datos reales.

- En los cuatro anchos de referencia no hubo desbordamiento horizontal (`scrollWidth` igual a `clientWidth`) y el bloque **Jornada publicada** permaneció visible.
- El recorrido con `Tab` alcanzó navegación, cierre de sesión y la acción de corrección; el foco visible de **Registrar entrada** se confirmó en el navegador.
- Se detectó un defecto en la pantalla inicial: una jornada actual `Sin iniciar` podía mostrar acciones derivadas del último evento histórico. Se corrigió para que las acciones se deriven primero del estado actual autorizado por el servidor. Tras recargar, sólo se ofrecía `Registrar entrada`.
- La regresión completa en Docker pasó con **119 pruebas en 34 archivos**. También se excluyó `.local` del contexto de Docker para evitar que perfiles temporales del navegador interfieran en las reconstrucciones.

### Refuerzo de contexto publicado — 15/09/2026

- Las pruebas de presentación cubren fecha, festivo, día laborable y calendario no publicado sin inventar turno. TypeScript y la regresión local completaron **138 pruebas en 38 archivos**.
- La imagen local se reconstruyó y el proyecto Compose sintético `time-control-s23-contract` quedó saludable y disponible en `http://localhost:3045` para revisión.
- E2E manual en navegador con el perfil sintético de empleado: la pantalla muestra turno, tramos, minutos, calendario, día laborable, vigencia, zona IANA y evidencia registrada; el enlace de discrepancia llega a Correcciones sin enviar ninguna solicitud ni registrar un fichaje. Antes de repetir la prueba se repuso idempotentemente el fixture sintético de empleado, que había quedado desvinculado en la base local de revisión.

## Secuencia recomendada

1. PO aprueba este contrato y sus límites.
2. Las sesiones propietarias responden si existe la fuente read-only mínima; si no, presentan una enmienda separada.
3. Se diseña el recorrido sintético y sus estados antes de abrir código.
4. Sólo tras superar las puertas anteriores se crea una sesión de implementación independiente.
