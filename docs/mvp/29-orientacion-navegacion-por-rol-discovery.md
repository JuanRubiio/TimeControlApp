# S28 — Discovery de orientación y navegación por rol

**Estado:** discovery en curso. **Issue:** [#39](https://github.com/JuanRubiio/TimeControlApp/issues/39). **Base:** `master` `85629f8`. **Límite:** no autoriza permisos, rutas públicas, telemetría ni ayuda activa.

## Hipótesis a comprobar

Cada persona debe reconocer su área de trabajo, destinos disponibles y siguiente acción sin que el menú revele una capacidad no autorizada ni se convierta en un mecanismo de soporte que recoja datos innecesarios.

## Evidencia disponible

La aplicación ya ofrece navegación específica por rol: Empleado dispone de Hoy, Historial, Correcciones y Solicitudes; Responsable de Mi centro, Equipo, Correcciones y Solicitudes; Administración de Resumen, Plantilla y jornadas, Trazabilidad y Configuración. Las rutas privadas están guardadas en servidor y el destino tras login se resuelve por roles, con `returnTo` limitado a rutas internas permitidas.

| Pregunta del discovery | Evidencia actual | Resultado provisional |
| --- | --- | --- |
| ¿Cada rol recibe una entrada segura? | La raíz y el login resuelven destino por rol; las rutas privadas verifican sesión. | Sí. |
| ¿El menú evita mezclar funciones de otros roles? | Cada navegación declara sólo sus destinos funcionales. | Sí, sujeto a RBAC de servidor. |
| ¿La persona entiende la siguiente acción? | Empleado muestra estado y siguiente acción; Responsable y Administración usan encabezados de ámbito. | Sí para el recorrido mínimo. |
| ¿Hace falta ayuda global, chatbot o búsqueda? | No existe evidencia de desorientación persistente y aumentaría datos/operación. | No ampliar. |

## Hallazgos de consistencia

Los fallos visuales de navegación detectados durante las validaciones anteriores se resolvieron al sustituir anclas de una vista única por rutas dedicadas de Responsable y al mantener la navegación completa en sus pantallas de solicitudes/correcciones. La protección de URL, el menú y la autorización siguen teniendo responsabilidades separadas: ocultar un enlace no concede acceso y una URL directa debe ser denegada por servidor si no corresponde al rol.

## Ficha UX para una ampliación futura

Sólo si se acredita una duda recurrente, el diseño deberá resolver una pregunta concreta con ayuda contextual pasiva en la misma vista, no con una nueva captura de soporte. Debe incluir estado de carga, vacío, error, recuperación, sesión vencida, teclado, foco, lector de pantalla y móvil; utilizar `ui-control`, `ui-action`, avisos y navegación existentes. Quedan prohibidos mensajes de urgencia, métricas de actividad, recomendaciones basadas en comportamiento, formularios libres, chatbots y accesos implícitos.

## Privacidad, seguridad y exclusiones

- No se añaden preferencias de navegación, perfilado, analítica de clics, cookies nuevas, telemetría, datos de contacto ni contenido laboral de soporte.
- La ayuda no decide permisos. La autorización permanece en el servidor, con retornos internos permitidos y sin redirecciones abiertas.
- No se introducen búsqueda global, automatizaciones, notificaciones, datos de terceros, cambios de RBAC, app nativa ni datos reales.

## Decisión candidata

El núcleo de la hipótesis está cubierto y las incidencias observadas ya recibieron corrección. Sin evidencia sintética adicional de una tarea concreta bloqueada, una nueva implementación duplicaría navegación ya entregada. La recomendación provisional es **no implementar**; si el PO busca una candidata del grupo, #39 sólo debería reabrirse con un problema de orientación medible y acotado, no como rediseño general.

## Validación de este discovery

Revisión documental de S19 y de las navegaciones actuales por rol. No cambia UI, API, datos ni contenedores; no aplica E2E en esta rama.
