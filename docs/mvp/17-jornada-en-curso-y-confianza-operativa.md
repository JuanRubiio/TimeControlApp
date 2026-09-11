# S17 — Jornada en curso y confianza operativa

**Estado:** propuesta pendiente de aprobación; no autoriza implementación. **Tamaño:** M. **Dependencias:** S4, S5, S7, S14 y datos de prueba S11. **Relación con piloto:** recomendable para una demo y para medir comprensión; no sustituye S15 ni habilita datos reales.

## Objetivo

Permitir que la persona empleada entienda, de un vistazo, si su jornada está en curso, en pausa o finalizada y cuánto tiempo efectivo lleva acumulado durante el día. El indicador debe reducir dudas sobre el siguiente fichaje sin convertirse en una fuente legal, salarial o de control de productividad.

## Entregable verificable

En `/employee`, una tarjeta de **Jornada en curso** muestra estado textual, tiempo efectivo acumulado y la última acción confirmada. El contador avanza sólo cuando la última secuencia confirmada indica trabajo activo; se congela en pausa y al finalizar jornada. Al recuperar foco, recargar, completar un fichaje o recibir un error, la pantalla recupera la proyección autorizada del servidor.

El texto debe decir que es una referencia en curso y que los eventos confirmados y el cálculo posterior son la evidencia de la jornada. Nunca se etiqueta como salario, horas extra legales, cumplimiento automático ni control de rendimiento.

## Alcance propuesto

- Proyección de sólo lectura de la jornada propia a una hora de referencia del servidor: estado, instante de referencia, minutos/segundos efectivos acumulados, último evento confirmado, zona efectiva y próxima acción permitida.
- Temporizador accesible en la vista web de empleado: estado textual, `role="status"` no intrusivo, actualización visual razonable y respeto a `prefers-reduced-motion`.
- Actualización después de entrada, salida, inicio/fin de pausa, recuperación de pestaña y reintento de red. La interacción sigue bloqueada e idempotente como en S4/S14.
- Tratamiento explícito de pausa abierta, jornada no iniciada, salida confirmada, medianoche y cambio horario con instantes UTC del servidor y zona IANA vigente.
- Copy y pruebas de estados, teclado, móvil y escritorio; evidencia con fixtures sintéticos estándar, partido y nocturno.

## Exclusiones

No crea eventos, no modifica `time_events`, cálculos persistidos, reglas, RBAC, auditoría, exportaciones ni decisiones de corrección. No incorpora cronometraje de actividad, ubicación, biometría, cámara, notificaciones, recordatorios, estimación de nómina, alertas de exceso, objetivos de productividad, fichaje automático, cierre de período, offline completo ni nuevos permisos.

## Decisión técnica que debe quedar cerrada antes de construir

La opción recomendada es una proyección read-only del servidor —ruta nueva o extensión compatible de la lectura propia existente— con un `asOf` de servidor. El navegador usa ese punto para animar sólo la referencia visual y vuelve a consultar al recuperar foco o confirmar una acción. No debe duplicar ni persistir el algoritmo S5 en el cliente.

La proyección contará intervalos confirmados de trabajo y el intervalo abierto sólo mientras el estado sea activo. Una pausa abierta congela el acumulado; una jornada cerrada no avanza. La representación usa duración real entre instantes UTC, por lo que conserva la semántica existente ante DST y jornada nocturna. La cifra se denomina **tiempo efectivo en curso (informativo)** hasta que exista el cálculo persistido aplicable.

## Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Que se interprete como nómina, exceso legal o decisión laboral | Copy fijo de dato informativo, sin términos salariales ni alertas normativas; conservar cálculo y evidencia como referencias separadas. |
| Reloj local manipulado o desfase de pestaña | Base `asOf` del servidor, reconsulta al volver a foco y tras una acción; no persistir ni auditar el contador de cliente. |
| Divergencia con S5 | Proyección de servidor reutiliza secuencia de eventos S4/S5; pruebas de pausa, medianoche, DST y secuencias inválidas. |
| Sobrecarga o ruido accesible | Un único estado anunciado en cambios semánticos; el incremento por segundo no se anuncia a lector de pantalla. |
| Confusión en kiosco | S17 sólo cubre la sesión personal web. Un temporizador de kiosco requeriría análisis separado de privacidad y pantalla compartida. |

## Criterios de aceptación

- Empleado identifica sin formación si está trabajando, en pausa, finalizó o aún no inició.
- El tiempo aumenta únicamente en estado de trabajo activo y se congela en pausa/salida; después de cada fichaje confirmado coincide con la proyección del servidor.
- Recarga, retorno a pestaña, fallo de red y reintento dejan claro si la cifra está actualizada o requiere consulta; nunca invitan a repetir un fichaje confirmado.
- Los casos nocturno y DST preservan fecha laboral y duración real del contrato S5.
- Empleado sólo recibe su propia proyección; responsable y administración conservan RBAC existente.
- El flujo es usable por teclado y en 320, 390, 768 y 1280 px; las pruebas S4/S5/S7/S14 y las nuevas pasan con datos sintéticos.

## Priorización de ampliaciones evaluadas

| Propuesta | Valor para piloto | Esfuerzo/riesgo | Recomendación |
|---|---|---|---|
| Temporizador de jornada en curso (S17) | Alto: mejora confianza y reduce duda de pausa/salida en el flujo diario. | M: proyección temporal, DST, accesibilidad y no duplicar S5. | Aprobar después de S14; implementar como dato informativo. |
| Configuración y exportación guiadas (S16) | Alto: evita que el piloto mida soporte técnico manual. | M; ya contratada sobre APIs existentes. | Prioridad superior si habrá piloto asistido con administración real. |
| Bandeja de correcciones más explicativa | Medio: ayuda a decidir y a entender el resultado. | S; presentación, sin reglas nuevas. | Incluir como refinamiento de S14/S16 cuando haya casos de usuario. |
| Vista de calendario/plan previsto | Medio, pero depende de reglas y vigencias que pueden inducir promesas. | M; riesgo laboral/UX. | Descubrir durante piloto; no aprobar aún. |
| Recordatorios o notificaciones | Potencialmente alto si se mide olvido recurrente. | M; canal, horarios, consentimiento y expectativas laborales. | Mantener fuera hasta evidencia y decisión explícita. |
| Cierre de período, ausencias, importación o nómina | No hay evidencia de bloqueo para la hipótesis actual. | M/L y riesgo alto. | Post-piloto; fuera de S17. |
| Analítica de productividad, GPS, biometría o vigilancia | No aporta a la hipótesis y contradice privacidad por defecto. | Alto. | Rechazado. |

## Pruebas necesarias

Pruebas unitarias de la proyección activa/pausa/finalizada y de intervalos entre eventos; integración autorizada de la lectura propia; E2E para entrada, pausa, fin de pausa, salida, recarga, foco y error de red; casos de medianoche y DST existentes; auditoría de que no hay mutación adicional; inspección con teclado, árbol accesible y viewports representativos.

## Decisiones requeridas

1. Aprobar que el indicador se denomine dato **informativo en curso** y no sustituye cálculo/evidencia final.
2. Aprobar una proyección read-only temporal de servidor sin persistencia ni nuevas reglas de cálculo.
3. Confirmar que S17 se limita a la sesión web individual y no aparece en kioscos compartidos.
4. Priorizar S17 frente a S16 sólo si el próximo hito es una demo de empleado; para piloto operativo, S16 sigue teniendo prioridad superior.
