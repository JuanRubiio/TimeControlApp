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
- `UiField`: etiqueta, control, ayuda y error asociado mediante `src/ui/controls.tsx`; conserva el elemento nativo dentro del campo.
- `UiSelect`: selector nativo con `ui-control`; no se sustituyen selectores por controles no accesibles.
- `UiAction`: acción primaria compacta y semántica `button`; usa `tone="secondary"`, `tone="danger"` o `tone="quiet"` para alternativa, riesgo explícito o acción textual. En formularios se declara `type="submit"` intencionadamente.
- `ui-filter`: selector compacto para filtrar listas, nunca un control de decisión.
- `StatusBadge`, `StatusNotice` y `LoadingBlock`: estado, feedback y carga reutilizables.
- Listas `admin-list` y tarjetas `admin-section`: estructura común para datos operativos.

Los tokens `--ui-control-height`, `--ui-action-height`, `--ui-control-radius` y `--ui-action-padding-inline` son la única fuente de tamaño para controles y acciones del catálogo. No se crean botones de ancho completo ni alturas ad hoc salvo en el patrón móvil documentado de una acción crítica.

Una excepción requiere justificación en el contrato de la funcionalidad: acciones de riesgo alto, controles de kiosco y cualquier interacción accesible que no pueda usar el patrón estándar. Toda pantalla modificada debe probar al menos carga, vacío/error, éxito, foco visible, teclado y 320/390/768/1280 px con datos sintéticos.
