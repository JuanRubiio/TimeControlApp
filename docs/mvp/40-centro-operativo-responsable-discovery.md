# E-TC-36 — Centro operativo diario para responsable de centro

**Estado:** discovery de producto y UX. Esta épica no autoriza monitorización, decisión laboral automática ni ampliación del ámbito RBAC.

## Problema y oportunidad

La vista actual del responsable ya limita personas y correcciones a sus centros autorizados, pero no le permite entender de forma rápida qué jornadas requieren revisión y dónde continuar. Para una demo/piloto, el valor no es medir rendimiento: es reducir la navegación entre pantallas al gestionar excepciones que ya tienen flujo humano.

## Resultado de experiencia

El responsable abre «Mi centro», elige una fecha y ve una lista de jornadas de su ámbito con un estado operativo y una única acción contextual. Cada estado explica qué evidencia existe y conduce a una pantalla autorizada; nunca sugiere una sanción ni determina un resultado laboral.

| Estado visible | Significado limitado | Acción posible |
| --- | --- | --- |
| Sin inicio | No hay un inicio confirmado para esa fecha en la fuente disponible. | Ver jornada o contactar por el canal corporativo aprobado. |
| En curso | Existe un inicio sin salida confirmada en la fuente disponible. | Ver jornada. |
| Con incidencia | El cálculo publicado contiene una incidencia explicable. | Ver jornada o revisión autorizada. |
| Corrección pendiente | Hay una solicitud pendiente dentro del centro. | Revisar corrección. |
| Cerrada | Hay cálculo disponible sin las situaciones anteriores. | Ver jornada. |

«Sin datos», error de lectura y fecha futura se muestran como estados de interfaz distintos; no se convierten en `Sin inicio` ni en cero.

## Límites de datos y autoridad

1. Sólo se consulta el centro vigente asignado al responsable. Varios centros se seleccionan de forma explícita; una manipulación de identificador recibe la misma denegación no reveladora que el resto de APIs de ámbito.
2. El resumen contiene nombre visible, fecha, estado, referencia de cálculo y correcciones ya autorizadas. Excluye coordenadas, IP, precisión, dispositivo, métricas de productividad, ranking, tiempos de navegación y datos de otros centros.
3. El estado es una lectura de eventos, cálculo y correcciones. No crea efectos, no modifica fichajes y no otorga permisos nuevos.
4. Aprobar o rechazar sigue ocurriendo sólo dentro de la revisión de corrección existente, con su motivo y auditoría. La tarjeta de resumen no incorpora decisiones rápidas.

## Interacción y accesibilidad

- Filtro por fecha con valor local explícito y selección de centro únicamente cuando hay más de uno autorizado.
- Lista semántica o tabla responsive; cada fila tiene texto de estado, no sólo color, y una acción cuyo nombre incluye el contexto.
- Estados de carga, vacío, 401/403/404 y fallo técnico reutilizan el patrón de recuperación segura. Reintentar no pierde fecha ni centro seleccionados.
- Teclado y lector de pantalla recorren primero el contexto, después el resumen y por último las filas. No hay actualización en vivo, polling ni avisos intrusivos.
- Las cifras del encabezado son contadores descriptivos, no objetivos, SLA ni indicadores individuales.

## Contrato de una entrega posterior

La implementación se dividirá en historias con contrato propio para: agregación de jornadas por centro/fecha en servidor, presentación accesible y navegación a correcciones/jornadas. Antes de desarrollo se validarán taxonomía con PO, minimización con DPO/asesoría laboral, permisos negativos, DST/medianoche, datos vacíos y E2E multicíentro exclusivamente sintético.

Quedan fuera planificación automática, alertas, notificaciones, geolocalización adicional, seguimiento continuo, ranking, nómina, ausencias, cálculo nuevo o cambios a los flujos de corrección.
