# S17 — Evolución integral de producto y ampliación controlada del MVP

**Estado:** evaluación documental completada con evidencia sintética; pendiente de aprobación final del propietario. No autoriza implementación. **Tamaño:** M de producto, diseño, evidencia y contratos posteriores. **Dependencias:** S13, S14, S15, S16 y feedback sintético/validado de usuarios. **Relación con piloto:** no habilita datos reales ni sustituye el Go/No-Go de S15.

## Objetivo

Evaluar el producto completo después del MVP integrado: qué experiencias, operaciones y capacidades faltan para que empleado, responsable, administración y soporte puedan usarlo con confianza, sin convertir esta sesión en una colección de funcionalidades desconectadas.

S17 entrega un mapa de oportunidades, prioridades y contratos de implementación separados. Su propósito es elegir el siguiente incremento con evidencia, límites de privacidad y coste operativo claros; no implementar nada durante la evaluación.

## Preguntas que debe resolver

1. ¿Dónde se bloquea, duda o abandona cada rol en la experiencia completa: acceso, fichaje, jornada, corrección, revisión, configuración, exportación y soporte?
2. ¿Qué problema impide demostrar valor en un piloto y cuál sólo sería una mejora agradable?
3. ¿Qué propuesta cabe sobre reglas, APIs y datos existentes, y cuál requiere una decisión laboral, legal, de seguridad o de modelo?
4. ¿Cómo se medirá la utilidad sin recoger telemetría invasiva ni ampliar la vigilancia?
5. ¿Qué debe implementar una sesión posterior y qué debe permanecer fuera hasta que el piloto aporte evidencia?

## Entregables verificables

- Journey por rol y mapa de fricciones basado en recorridos sintéticos, revisión de soporte y entrevistas/feedback minimizado si S15 lo autoriza.
- Backlog de oportunidades con problema, usuario afectado, hipótesis, dependencia, impacto, esfuerzo, riesgo de privacidad/legal y métrica cualitativa o técnica mínima.
- Priorización explícita: **ahora**, **después del piloto** o **rechazado**.
- Un contrato independiente por cada iniciativa aprobada para implementación, con dueña, rutas/APIs/tablas afectadas, exclusiones y pruebas. S17 no será propietaria de esas modificaciones.
- Actualización de README, guía e informe de piloto para explicar decisiones de producto y límites, sin prometer cumplimiento automático.

## Áreas de evaluación

| Área | Pregunta de producto | Señales de valor | Límites innegociables |
|---|---|---|---|
| Inicio y confianza | ¿Cada persona entiende su rol, su siguiente acción y qué puede esperar? | Menos dudas de acceso, rutas y permisos; orientación clara. | Sin perfiles compartidos, dark patterns ni debilitamiento de MFA/RBAC fuera de demo local. |
| Jornada diaria | ¿Fichar, pausar y terminar es inequívoco y fácil de verificar? | Menos reintentos, menos pausas olvidadas, más comprensión del estado. | Eventos append-only, pausas manuales, sin geolocalización, biometría ni vigilancia. |
| Correcciones y revisión | ¿La propuesta, la decisión y su efecto son comprensibles para ambas partes? | Menos solicitudes incompletas y rechazos sin contexto. | Correcciones aditivas; la decisión humana no se oculta ni se reabre por intuición. |
| Administración | ¿Puede preparar el piloto, revisar y exportar sin depender del equipo técnico? | Menos pasos por API/soporte; decisiones autorizadas más rápidas. | S16/S15 conservan validaciones, vigencias, auditoría y alcance servidor. |
| Soporte y adopción | ¿La ayuda resuelve una duda sin capturar datos innecesarios? | Incidencias reproducibles y soporte minimizado. | Sin registrar credenciales, PIN, secretos ni contenido laboral innecesario. |
| Plataforma y piloto | ¿El despliegue, operación y datos demo permiten una demostración segura? | Arranque reproducible, recuperación y Go/No-Go comprensible. | S15 sigue siendo puerta obligatoria para datos reales. |

## Backlog inicial a evaluar

| Oportunidad | Problema / hipótesis | Prioridad inicial | Dependencias y riesgo | Resultado de S17 |
|---|---|---|---|---|
| Estado y temporizador de jornada en curso | Una persona no siempre sabe cuánto trabajo efectivo acumula o si la pausa está activa. Un contador informativo reduce la incertidumbre. | Alta para demo de empleado | Proyección temporal de servidor, DST, jornada nocturna y accesibilidad. No puede duplicar S5 ni ser nómina. | Decidir contrato propio si se valida. |
| Configuración y exportación guiadas | El piloto puede medir soporte manual en vez de producto si altas, reglas y exportaciones exigen API. | Alta para piloto operativo | S16 y cierre de almacenamiento/retención S15. | Mantener S16 o concretar su mínimo. |
| Bandeja de revisión orientada a decisión | El responsable necesita ver contexto, impacto y pendiente sin perder auditoría. | Media-alta | Sólo presentación/lectura autorizada; no añadir automatismos ni SLA laborales. | Refinar S14/S16 o contrato acotado. |
| Ayuda contextual y recuperación | Errores, incidencias y límites pueden requerir formación técnica. | Media | Copy, accesibilidad y canal de soporte minimizado. | Diseñar patrón común, no chatbot ni captura libre de PII. |
| Vista de calendario y planificación visible | Entender jornada esperada puede reducir dudas sobre incidencias. | Media, pendiente evidencia | Riesgo de interpretar reglas como cumplimiento o promesa de horario. | Descubrir durante piloto antes de contratar. |
| Inicio guiado de empresa | Preparar la primera empresa sin intervención técnica puede mejorar activación. | Media | Es parte de S16; vigencias, datos y validación de reglas. | No duplicar S16. |
| Feedback estructurado de piloto | Recoger fricción sin dispersión por canales informales. | Media | S15: responsable, retención, minimización y soporte. | Definir fuera de la aplicación o contrato posterior. |
| Recordatorios de fichaje/corrección | Podrían reducir olvidos si el piloto los confirma. | Baja hasta evidencia | Canal, horarios, consentimiento, ruido y expectativa laboral. | No implementar sin decisión de producto/privacidad. |
| Importación, ausencias, cierre de período y nómina | Podrían ampliar operación, pero no validan la hipótesis inicial. | Post-piloto | Modelos, convenios, reglas y riesgo alto. | Mantener fuera. |

## Propuesta destacada: jornada en curso

No es el alcance de S17, sino una candidata prioritaria. Si se aprueba su contrato posterior, debe mostrar estado textual y **tiempo efectivo en curso (informativo)**. Avanza únicamente mientras la secuencia confirmada está activa, se congela en pausa/salida y se actualiza tras fichar, recargar o recuperar foco.

La opción recomendada es una proyección read-only temporal del servidor con `asOf`, estado y acumulado, reutilizando los eventos confirmados y semántica S4/S5 sin persistir una nueva cifra ni calcular en el cliente. Debe cubrir UTC, zona IANA, medianoche y DST. Nunca se etiqueta como salario, horas extra legales, cumplimiento o productividad; los eventos y el cálculo persistido siguen siendo la evidencia.

## Marco de priorización

Una oportunidad sólo pasa a contrato de implementación si cumple todos los criterios:

1. Resuelve una fricción observada en recorrido, demo o feedback minimizado, no una intuición aislada.
2. Tiene valor claro para al menos un rol y no traslada trabajo o riesgo a otro sin justificación.
3. Respeta privacidad por defecto y no introduce vigilancia, perfilado de rendimiento ni datos innecesarios.
4. Conserva la fuente de verdad de eventos, cálculos, autorización y auditoría, o declara explícitamente el contrato que debe cambiarlos.
5. Tiene criterios observables de aceptación, regresión y reversión.
6. No adelanta S15 cuando implique datos reales, retención, seguridad, soporte o cumplimiento.

## Exclusiones y rechazos

S17 no implementa funcionalidades, cambia modelos, contratos API, cálculos, reglas, roles, auditoría o exportaciones. Quedan rechazados para este ciclo GPS/geolocalización, biometría, reconocimiento facial, cámara, foto, vídeo, vigilancia, monitorización de pantalla, analítica de productividad, fichaje automático, app nativa, nómina, interpretación de convenios y dark patterns.

También quedan fuera, hasta evidencia y aprobación, notificaciones, vacaciones/ausencias, cierre de período, importación CSV/Excel, conectores de nómina, SSO, turnos complejos y reapertura de decisiones.

## Criterios de cierre de S17

- Las oportunidades se trazan a evidencia, rol, riesgo y decisión, con responsables explícitos.
- La lista de “ahora” es pequeña, ordenada y no contradice S15/S16 ni los no negociables de privacidad.
- Cada funcionalidad aprobada tiene un contrato nuevo y separado antes de tocar código.
- La guía de piloto comunica sólo capacidades existentes; las propuestas no se presentan como entregadas.
- El propietario del producto aprueba la prioridad final y qué evidencia debe obtenerse en el piloto.

## Decisiones requeridas

1. Confirmar que S17 es una sesión de descubrimiento integral, no de implementación.
2. Elegir el siguiente foco: experiencia de empleado (temporizador), operación de piloto (S16) o aprendizaje/soporte (feedback minimizado).
3. Acordar participantes sintéticos, guion de evaluación y canal de feedback bajo S15.
4. Aprobar o rechazar cada contrato posterior de forma independiente.

## Registro de ejecución S17 — 11/09/2026

### Base de evidencia y límites

La evaluación usa únicamente el recorrido integrado y los fixtures sintéticos `office` y `multisite` de S11/S13, la auditoría visual de S14, la guía de piloto y los contratos S13–S16. No hubo entrevistas, tickets de soporte, telemetría de uso ni datos reales: S15 todavía no ha autorizado participantes, canal, responsable, retención ni base de feedback. Por tanto, los hallazgos siguientes son hipótesis trazadas a evidencia sintética; no se presentan como comportamiento observado en producción ni como decisión final de producto.

No se han modificado código, UI, APIs, permisos, auditoría, cálculos, modelos, tablas, migraciones ni exportaciones. Los contratos que S17 debe consumir siguen siendo los de S13 (recorridos y hallazgos), S14 (presentación y accesibilidad), S15 (Go/No-Go, operación y feedback) y S16 (configuración y exportación sobre APIs existentes). S17 no consume ni crea una API o tabla propia.

### Journey sintético y mapa de fricciones

| Rol y recorrido | Evidencia disponible | Fricción o límite | Riesgo | Decisión propuesta |
|---|---|---|---|---|
| Empleado: acceso, MFA, fichaje, pausa, salida e historial | S13 validó login, fichaje idempotente, pausas, jornada nocturna y DST; S14 mejoró acción siguiente, foco y estados. | No hay evidencia de uso continuado ni de si el estado actual basta para resolver dudas durante una jornada. | Convertir un cálculo informativo en control de productividad o nómina. | Obtener evidencia cualitativa en piloto; sólo entonces valorar un contrato separado para la proyección temporal read-only. |
| Empleado: corrección y seguimiento | S13 recorrió corrección sintética y decisión; S14 explica inmutabilidad y decisión humana. S13-008 sigue sin reproducirse con un segundo evento. | La segunda corrección puede resultar confusa; no se sabe aún si es una protección intencional o un defecto. | Alterar semántica aditiva o permitir duplicados por intuición. | Reproducir bajo dataset sintético antes de proponer cualquier cambio de selector o regla. |
| Responsable: revisión y decisión | S13 comprobó ámbito por centro y aprobaciones/rechazos; S14 mejoró jerarquía y bloqueo durante el envío. | Falta evidencia de volumen, tiempos de decisión o contexto insuficiente en un caso realista. | Introducir SLA, automatismos o reapertura de decisiones laborales. | Mantener la bandeja actual; recoger feedback minimizado tras el protocolo S15. |
| Administración: alta, configuración y exportación | S13-006 y la guía confirman que configuración y CSV/PDF siguen siendo operaciones asistidas por API. | El piloto puede medir soporte técnico en lugar de producto. | Presentar reglas como cumplimiento automático o habilitar descargas sin retención cerrada. | Decidir si S16 es condición del piloto; sólo S16 puede exponer UI sobre las APIs existentes, tras el cierre de almacenamiento S15. |
| Soporte y adopción: ayuda y recuperación | La guía ofrece escalado minimizado; S13/S14 prueban mensajes recuperables. | No existe aún canal, severidad, responsable ni retención aprobados para feedback. | Recoger credenciales, PIN, secretos o contenido laboral innecesario. | S15 debe definir el protocolo fuera de la aplicación; no crear chatbot, formulario libre ni telemetría. |
| Plataforma y piloto: despliegue, datos y operación | S13-005 y el informe mantienen NO-GO por TLS/WAF/rate limit, restore, retención y aprobaciones externas. | No hay evidencia de operación segura con datos reales. | Pérdida, cruce o conservación indebida de datos. | Prioridad obligatoria: completar S15 antes de cualquier piloto con datos reales o de presentar nuevas capacidades como disponibles. |

### Backlog evaluado

| Oportunidad | Usuario y problema | Hipótesis y evidencia | Dependencia | Impacto / esfuerzo | Riesgo de privacidad, legal u operación | Métrica mínima no invasiva | Decisión S17 |
|---|---|---|---|---|---|---|---|
| Cierre operativo prepiloto | Todas las personas; el piloto no es seguro ni recuperable sin controles de operación. | S13-005 P1 abierto y NO-GO documentado. | S15, proveedor y aprobaciones externas. | Alto / M. | Alto: seguridad, retención, restore y cumplimiento. | Evidencias binarias S15: restore aislado, rechazo cruzado, borrado auditado y aprobaciones. | **Ahora: obligatorio**, propiedad S15; no ampliar producto. |
| Configuración y exportación guiadas | Administración depende de APIs/soporte para tareas rutinarias. | S13-006, evaluación prepiloto y guía. | S16; almacenamiento, vencimiento y auditoría cerrados por S15. | Alto para piloto asistido / M. | Medio-alto: vigencias, RBAC y exportaciones. | Recorrido sintético autorizado completo, con denegaciones RBAC y descarga vencida. | **Ahora: decidir** si S16 es condición del piloto; su implementación sigue siendo propiedad exclusiva de S16. |
| Estado y tiempo efectivo de jornada | Empleado puede dudar del estado de pausa/jornada y del acumulado informativo. | Candidata de S17; S13/S14 prueban estado, pero no necesidad repetida. | Nueva sesión aprobada; semántica S4/S5 y pruebas UTC/DST. | Medio / M. | Medio: riesgo de vigilancia, nómina o cálculo cliente. | Entrevista/recorrido minimizado que confirme comprensión sin telemetría de productividad. | **Después del piloto**; no hay contrato aprobado. |
| Ayuda contextual y recuperación | Un error o incidencia puede exigir apoyo técnico. | Guía y S14 cubren mensajes; no hay evidencia de dudas recurrentes. | Protocolo de soporte y feedback S15. | Medio / S–M. | Medio: captura excesiva de PII o secretos. | Clasificación manual y minimizada de incidencias, sin contenido sensible. | **Después del piloto**; patrón común, no chatbot ni formulario libre. |
| Bandeja de revisión con más contexto | Responsable puede necesitar más contexto para decidir. | S13/S14 validaron flujo actual, sin evidencia de volumen o bloqueo. | Feedback S15; S6/S8. | Medio / S–M. | Medio: automatización laboral o exposición de datos. | Feedback cualitativo por rol sobre comprensión de la evidencia. | **Después del piloto**; no cambiar decisiones ni SLA. |
| Calendario/planificación visible | Podría reducir dudas sobre jornada esperada. | Sólo hipótesis; evaluación prepiloto no acredita bloqueo. | Evidencia de piloto, S3 y asesoría laboral si cambia interpretación. | Medio / M. | Alto: promesa de horario o cumplimiento. | Duda recurrente documentada y validada por responsable. | **Después del piloto**. |
| Recordatorios | Podrían reducir olvidos. | Sin evidencia ni canal/consentimiento aprobado. | Decisión de producto, privacidad y canal. | Bajo incierto / M. | Alto: presión laboral, horarios y ruido. | Evidencia explícita de piloto y opt-in aprobado. | **Rechazado para este ciclo**. |
| Importación, ausencias, cierre de período, nómina, conectores y turnos complejos | Ampliación de operación no necesaria para validar la hipótesis del MVP. | Evaluación prepiloto y README los aplazan o excluyen. | Nuevo descubrimiento y contratos independientes. | Variable / M–L. | Alto: modelo, convenios, calidad de datos y cumplimiento. | Evidencia posterior al piloto y aprobación explícita. | **Rechazado para este ciclo**. |

### Priorización y aprobación pendiente

1. **Ahora:** cerrar S15 y decidir por escrito si S16 es condición del piloto. No se autoriza por esta sesión ninguna funcionalidad nueva.
2. **Después del piloto:** evaluar con feedback minimizado la jornada en curso, ayuda contextual, contexto de revisión y calendario visible; cada candidata requiere un contrato nuevo y aprobación independiente antes de tocar código.
3. **Rechazado para este ciclo:** recordatorios, importación CSV/Excel, ausencias, cierre de período, nómina, conectores, SSO, turnos complejos y cualquier tecnología de vigilancia o recogida invasiva.

La priorización es una recomendación basada en la evidencia arriba indicada. El propietario del producto debe aprobar la prioridad final, el foco posterior y el protocolo de participantes/feedback de S15 antes de cerrar S17 como aprobada o abrir contratos de implementación.

### Estado final, archivos y validación

- **Alcance completado:** journey sintético por rol, mapa de fricciones, backlog trazable, clasificación ahora/después/rechazado y registro explícito de límites y aprobaciones pendientes.
- **Archivos y contratos afectados:** este contrato, `README.md`, guía de usuario del piloto e informe de preparación. Se consumen S13, S14, S15 y S16; no se modifican sus contratos ni módulos.
- **Decisiones tomadas:** ninguna decisión de producto, arquitectura, privacidad, seguridad, legal o modelo de datos se ha asumido. Se conserva el NO-GO de S15 y la exclusión de datos reales.
- **Pruebas ejecutadas:** `git diff --check`, revisión de enlaces/estado y, con fixtures sintéticos, `docker compose --env-file .s13.synthetic.env run --rm --no-deps app npm test` y `docker compose --env-file .s13.synthetic.env run --rm --no-deps app npx tsc --noEmit`; ambos comandos finalizaron correctamente (código 0). No se añaden pruebas nuevas porque no hay modificación de código, datos, API ni UI.
- **Riesgos y bloqueos restantes:** aprobación final del propietario; elección de foco posterior; protocolo S15 para participantes, feedback, soporte y retención; todos los bloqueos operativos/compliance S15; y apertura de PR pendiente de autenticar GitHub CLI (`gh auth login` o `GH_TOKEN`). La rama y el commit de S17 sí se publicaron correctamente.
