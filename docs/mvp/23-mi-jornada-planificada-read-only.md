# S23 — Mi jornada planificada, sólo lectura

**Estado:** contrato de diseño sintético en refinamiento; no autoriza desarrollo ni datos reales. **Historia:** HU-TC-024 / #45. **Tamaño propuesto:** M. **Propietaria:** S23 para su futura proyección read-only, ruta, presentación y pruebas. **Dependencias:** S3, S11, S14, S20, decisión PO y revisión laboral si el copy o los datos cambian su interpretación.

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

## Puertas y decisiones pendientes

- **PO:** confirma rango temporal inicial, vocabulario de discrepancia y si el enlace de corrección se muestra sólo cuando existe una capacidad ya autorizada.
- **S3/S4/S5/S6:** confirman la fuente pública mínima y su propiedad; ninguna sesión consumidora accede a tablas o internals ajenos.
- **UX/accesibilidad:** valida que `previsto` no parezca una instrucción, que el vacío sea comprensible y que no se dependa del color.
- **Asesoría laboral:** revisa el copy únicamente si se amplía el significado de los datos más allá de la información operativa publicada.
- **S15:** sigue siendo NO-GO para datos reales; S23 no lo adelanta ni modifica.

## Secuencia recomendada

1. PO aprueba este contrato y sus límites.
2. Las sesiones propietarias responden si existe la fuente read-only mínima; si no, presentan una enmienda separada.
3. Se diseña el recorrido sintético y sus estados antes de abrir código.
4. Sólo tras superar las puertas anteriores se crea una sesión de implementación independiente.
