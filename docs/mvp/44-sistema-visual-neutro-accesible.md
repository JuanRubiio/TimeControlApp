# ADR-0009 — Sistema visual neutro, operativo y accesible

**Estado:** propuesta para revisión de Producto, UX y QA. **Propietaria:** #119. **Alcance:** capa de presentación transversal; no modifica procesos, permisos ni datos.

## Contexto y lectura de la referencia

La referencia aportada comunica una interfaz operativa tranquila: lienzo neutro cálido, tarjetas blancas contenidas, bordes discretos, navegación estable y una retícula densa pero respirable. El acento turquesa se reserva para selección y acción; ámbar y rojo aparecen únicamente cuando el estado lo requiere. Esta dirección mejora la jerarquía de TimeControl sin trasladar su marca, logotipo, iconografía, contenido, topología o estructura de navegación.

La aplicación ya tiene una fundación útil: controles de 44 px, acciones de 40 px, foco visible, escala de radios y variantes semánticas de aviso. Sin embargo, `globals.css` mezcla esos tokens con azules, gradientes, bordes y sombras codificados directamente en shells, formularios, tarjetas, navegación y Configuración. El resultado es consistente dentro de una pantalla, pero hace costoso evolucionar el tono global y aumenta el riesgo de divergencia entre roles.

## Decisión propuesta

Adoptar tokens semánticos neutrales como única fuente de color de la capa compartida. La conversión se hará por superficie y mantendrá los contratos, clases públicas y acciones existentes. Ningún componente elegirá un hexadecimal por intención visual si existe un token equivalente.

| Familia | Token | Valor inicial orientativo | Uso permitido |
| --- | --- | --- | --- |
| Lienzo | `--canvas` | `#F5F6F4` | Fondo de aplicación; no comunica estado. |
| Superficies | `--surface`, `--surface-subtle` | `#FFFFFF`, `#F7F9F8` | Tarjetas y zonas secundarias. |
| Contornos | `--line`, `--line-strong` | `#E3E8E5`, `#CCD5D1` | Separación y controles; nunca sustituyen el foco. |
| Texto | `--ink`, `--muted` | `#1C2526`, `#60706C` | Contenido principal y auxiliar. |
| Acción | `--primary`, `--primary-dark`, `--primary-soft` | `#118F8C`, `#08716E`, `#E1F5F2` | Acción primaria, enlace/hover y selección. |
| Éxito | `--success`, `--success-bg` | `#167A61`, `#E6F6EF` | Confirmación explícita. |
| Aviso | `--warning`, `--warning-bg` | `#9A6200`, `#FFF4DF` | Atención no crítica. |
| Riesgo | `--danger`, `--danger-bg` | `#B8493C`, `#FFF0EE` | Error, bloqueo o acción destructiva. |
| Foco | `--focus` | `#0E6EAA` | Teclado: anillo de alto contraste, independiente de la variante. |

Los valores son una dirección inicial, no una extracción de activos de terceros. Antes de incorporarlos se medirán combinaciones de texto y fondo contra WCAG AA; los valores que no alcancen el contraste se ajustarán, no se forzarán por similitud visual.

## Patrones que se conservarán o se introducirán

| Patrón | Regla de diseño | Aplicación inicial |
| --- | --- | --- |
| Shell y navegación | Lienzo plano, panel lateral sutil y destino activo con superficie `primary-soft`, texto e indicador no cromático. | Todos los roles. |
| Tarjeta | Fondo `surface`, borde tenue, radio compartido y sombra de elevación baja; sin gradiente decorativo por defecto. | Inicios #114–#117, Configuración #102 y listados. |
| Acción | Sólo una primaria por bloque de tarea; secundaria sobria y destructiva diferenciada por etiqueta, icono y color. | Formularios, planificación y decisiones. |
| Dato operativo | Tipografía tabular para tiempos/cifras, etiqueta visible y estado textual. | Jornada, resumen, cuadrante y tarjetas. |
| Estado de calendario | Color + texto/icono/patrón: vacaciones, descanso, ausencia y festivo mantienen su semántica aunque se vea en escala de grises. | Inicio empleado y cuadrante. |
| Progresión | Detalles secundarios plegables, vacíos explicativos y carga estable sin desplazamiento brusco. | Inicio, Configuración y operaciones largas. |

No se crea búsqueda global, centro de notificaciones, telemetría, gráfico operativo, asistencia conversacional ni métrica de productividad por parecer presentes en una referencia.

## Inventario y plan de migración

1. **Fundación:** consolidar en `:root` las familias anteriores y sustituir los colores repetidos de los controles compartidos (`button`, `ui-control`, `ui-action`, avisos, foco y enlaces). Validar teclado, zoom 200 % y contraste.
2. **Contenedor:** migrar `employee-shell`, `admin-shell`, navegación y secciones al sistema de lienzo/superficie. No cambiar rutas ni la visibilidad definida por RBAC.
3. **Componentes:** migrar tarjetas, formularios, listas, tablas, badges, vacíos, carga y detalles plegables. Eliminar gradientes decorativos donde no expresen estado.
4. **Superficies por prioridad:** Configuración (#102), inicio de empleado (#115), inicio de responsable (#116) e inicio de administración (#117). Cada una se entrega en su historia, con regresión visual sintética y E2E de sus flujos.
5. **Retirada:** tras adoptar los tokens, eliminar colores directos que hayan quedado obsoletos y comprobar escritorio 1280 px, tableta 768 px y móvil 390/320 px.

La migración no debe coexistir con una modificación funcional de la misma pantalla si se puede evitar: una PR de superficie debe poder revertirse sin alterar datos ni contratos.

## Accesibilidad y movimiento

- Contraste mínimo AA para texto, iconos informativos y foco; los estados no dependen sólo del color.
- Foco visible uniforme y no tapado por sombras, paneles o `overflow`.
- Controles táctiles y de teclado conservan la altura contractual (44 px / 40 px cuando aplique).
- `prefers-reduced-motion` reduce transiciones sin ocultar el cambio de estado; las animaciones no retrasan lectura ni acción.
- Las tablas/listas conservan cabeceras, etiquetas y orden de foco. Un UUID o identificador técnico queda en detalle progresivo.

## Límites y decisión pendiente

Esta ADR no cambia la fuente, no descarga tipografías, no introduce un kit de iconos externo y no altera el sistema funcional actual. Producto debe validar la dirección cromática, UX debe cerrar los tokens y QA debe aprobar la matriz de contraste y los tres tamaños de referencia antes de abrir la primera historia de implementación transversal.

## Validación de esta fase

- Auditoría estática de `src/app/globals.css` y de sus patrones compartidos.
- Revisión de la propuesta contra las superficies de empleado, responsable, administración y Configuración.
- No aplica E2E en esta fase: no se cambia código de producto ni comportamiento. Cada PR de migración deberá añadir su validación visual y E2E correspondiente.
