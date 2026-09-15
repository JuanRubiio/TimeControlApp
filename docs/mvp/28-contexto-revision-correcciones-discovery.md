# S27 — Discovery de contexto para revisión de correcciones

**Estado:** discovery en curso. **Issue:** [#38](https://github.com/JuanRubiio/TimeControlApp/issues/38). **Base:** `master` `85629f8`. **Límite:** no autoriza una decisión automática, una reapertura ni ampliar el ámbito de lectura.

## Hipótesis a comprobar

Un responsable autorizado puede necesitar contexto adicional para decidir una corrección, pero el contexto debe ser suficiente para una decisión humana y no transformarse en un expediente de rendimiento, una bandeja de prioridades o una lectura de datos fuera de su centro.

## Evidencia disponible

El flujo existente ya cubre la evidencia mínima de una solicitud: lista de pendientes por ámbito, persona autorizada, fecha laboral, estado, origen, propuesta, motivo de la persona solicitante y decisión registrada. La decisión sólo está disponible para Responsable dentro de su centro; Administración conserva consulta de trazabilidad sin facultad de aprobar o rechazar. El servidor conserva la solicitud y el evento original, y una aprobación crea un efecto aditivo.

| Pregunta del discovery | Evidencia actual | Resultado provisional |
| --- | --- | --- |
| ¿El responsable puede localizar pendientes de su ámbito? | `/manager/corrections` filtra solicitudes pendientes y enlaza a revisión. | Sí. |
| ¿Puede comprender la propuesta y el motivo? | El detalle muestra propuesta, fecha, motivo y estado. | Sí, para el caso mínimo. |
| ¿La decisión mantiene control humano y trazabilidad? | Aprobación/rechazo idempotentes; rechazo exige motivo; no hay reapertura. | Sí. |
| ¿Hace falta sumar historial, ranking o SLA? | No existe evidencia de volumen o bloqueo y esos datos elevarían el riesgo. | No ampliar. |

## Propuesta UX si apareciera evidencia nueva

Una futura ficha no debe añadir tarjetas de productividad ni una línea temporal exhaustiva. Sólo podría ordenar la evidencia ya autorizada en bloques progresivos:

1. Solicitud: persona, fecha, estado y motivo.
2. Cambio propuesto: acción e instante, con la fuente original conservada.
3. Decisión humana: aprobar o rechazar, confirmación, error idempotente y motivo obligatorio al rechazar.
4. Trazabilidad técnica plegada y accesible únicamente cuando sea necesaria para auditoría.

Debe cubrir carga, vacío, solicitud fuera de ámbito, decisión ya registrada, conflicto de reintento, error recuperable, teclado, foco, lector de pantalla y móvil. Las acciones usan el catálogo visual común; la opción destructiva de rechazo conserva jerarquía y texto explícito.

## Privacidad, RBAC y exclusiones

- No se muestran fichajes ajenos, motivo de otras solicitudes, historial disciplinario, métricas, ranking, tiempos de respuesta, recomendación de decisión, reglas internas ni datos de otros centros.
- Responsable decide sólo dentro de su centro. Administración configura y consulta trazabilidad autorizada, pero no decide correcciones; el enlace visual no sustituye la autorización de servidor.
- No se modifica la inmutabilidad de eventos, los estados `pending → approved | rejected`, la auditoría ni la recalculación existente.
- No hay SLA, delegación, reapertura, automatización, notificación, telemetría, exportación ni datos reales durante este discovery.

## Decisión candidata

La hipótesis de una bandeja mínima ya está cubierta. Una ampliación de contexto sólo se justificará si recorridos sintéticos posteriores prueban que el responsable no entiende una evidencia específica pese a la vista actual; entonces requerirá un contrato propio con la lista exacta de campos permitidos y pruebas negativas de ámbito. La recomendación provisional es **no implementar** y comparar esta conclusión con #37 y #39.

## Validación de este discovery

Revisión documental de S6, de los límites de rol y de la superficie actual de Responsable. No cambia UI, API, datos ni contenedores; no aplica E2E en esta rama.
