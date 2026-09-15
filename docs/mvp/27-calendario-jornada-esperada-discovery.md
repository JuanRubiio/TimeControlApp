# S26 — Discovery de jornada esperada y calendario publicado

**Estado:** discovery en curso. **Issue:** [#37](https://github.com/JuanRubiio/TimeControlApp/issues/37). **Base:** `master` `85629f8`. **Límite:** no autoriza planificación, edición ni datos reales.

## Hipótesis a comprobar

Una persona empleada podría necesitar consultar la jornada publicada para entender una discrepancia sin que la aplicación convierta reglas o turnos en una orden de disponibilidad, una interpretación de convenio o una decisión laboral.

## Evidencia disponible

La hipótesis mínima ya tiene cobertura sintética entregada por HU-TC-024 / S23: la pantalla de empleado muestra la jornada publicada del día, su turno, tramos, calendario, vigencia, zona IANA y la evidencia registrada; cuando falta una fuente, comunica el vacío y ofrece el flujo existente de corrección. S23 no permite editar ni planificar y mantiene el texto de información operativa.

| Pregunta del discovery | Evidencia actual | Resultado provisional |
| --- | --- | --- |
| ¿Se puede conocer el previsto sin calcularlo en cliente? | S23 consume una proyección read-only resuelta en servidor. | Sí, para la fecha laboral actual. |
| ¿Se distingue previsto de registrado? | S23 separa turno/calendario publicados y evidencia confirmada. | Sí; no hay saldo, nómina ni consecuencia. |
| ¿La ausencia de datos inventa una obligación? | S23 muestra ausencia de fuente o evidencia incompleta. | No. |
| ¿Falta un rango histórico o planificación? | No hay evidencia sintética de necesidad y el selector histórico sigue excluido. | No ampliar. |

## UX, privacidad y límites

- El recorrido debe seguir siendo sólo de lectura, con etiquetas de fuente/vigencia y una acción de corrección ya autorizada; no puede mostrarse como una orden, una alerta ni una métrica de desempeño.
- Cualquier futuro selector de fecha exige estados para fecha no disponible, jornada nocturna, DST, sin calendario, sin turno y evidencia incompleta, además de teclado, foco, lector de pantalla y móvil.
- No se incorporan datos de terceros, disponibilidad, preferencias, cambios de turno, ausencias, recordatorios, telemetría ni contactos de soporte.
- S3/S4/S5/S6 siguen siendo propietarios de reglas, zona, cálculo y autorización. Esta investigación no abre tablas, rutas, APIs, RBAC, auditoría ni exportaciones.

## Decisión candidata

La propuesta original de #37 no es una candidata nueva de implementación: su valor mínimo ya está cubierto por #45. Sólo podría abrirse una historia distinta si el piloto sintético acredita una duda concreta que la vista actual no resuelve y PO aprueba explícitamente el alcance (por ejemplo, un rango de fechas estrictamente read-only). Hasta entonces, la recomendación es **no implementar** y comparar esta conclusión con #38 y #39.

## Validación de este discovery

Revisión documental de S23 y sus límites; no cambia UI, API, datos ni contenedores, por lo que no aplica E2E en esta rama.
