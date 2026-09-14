# S25 — Catálogo de componentes y límites de rol

## Límites de actor

| Actor | Puede | No puede |
|---|---|---|
| Empleado | Fichar, consultar su información y proponer correcciones o solicitudes propias. | Consultar o decidir información de otras personas. |
| Responsable | Consultar su centro y decidir correcciones y solicitudes dentro de ese ámbito. | Configurar la organización, acceder a otro centro o actuar fuera de su ámbito. |
| Administración | Configurar empresa, centros, personas, reglas y consultar trazabilidad autorizada. | Aprobar, rechazar o alterar correcciones: no existe excepción administrativa. |

La autorización se aplica en servidor con permiso y ámbito de centro. La UI sólo expresa capacidades ya autorizadas; nunca concede acceso por sí misma.

## Catálogo visual

Todos los controles nuevos usan las clases del catálogo en `globals.css`, salvo una excepción documentada:

- `ui-control`: entradas, selectores y áreas de texto; borde azul gris, radio 10px, foco azul de tres píxeles y altura compacta.
- `ui-field`: etiqueta, control y ayuda contextual con separación uniforme.
- `ui-action`: acción primaria compacta; `ui-action--danger` para acciones destructivas o de rechazo explícito.
- `ui-filter`: selector compacto para filtrar listas, nunca un control de decisión.
- `StatusBadge`, `StatusNotice` y `LoadingBlock`: estado, feedback y carga reutilizables.
- Listas `admin-list` y tarjetas `admin-section`: estructura común para datos operativos.

Una excepción requiere justificación en el contrato de la funcionalidad: acciones de riesgo alto, controles de kiosco y cualquier interacción accesible que no pueda usar el patrón estándar.
