# S17 — Evolución integral de producto y ampliación controlada del MVP

**Estado:** propuesta de descubrimiento y priorización; no autoriza implementación. **Tamaño:** M de producto, diseño, evidencia y contratos posteriores. **Dependencias:** S13, S14, S15, S16 y feedback sintético/validado de usuarios. **Relación con piloto:** no habilita datos reales ni sustituye el Go/No-Go de S15.

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
