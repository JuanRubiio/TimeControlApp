# HU-TC-036 — Estados críticos consistentes y recuperación segura

**Estado:** refinamiento documentado; pendiente de aprobación PO antes de implementar. **Issue:** [#82](https://github.com/JuanRubiio/TimeControlApp/issues/82). **Dependencias:** S14, S19, S25 y QA. **Límite:** no cambia sesión, RBAC, APIs, auditoría de dominio, datos, cálculo ni el NO-GO S15.

## Problema y evidencia de discovery

La aplicación ya protege las páginas en servidor (S19), limita `returnTo` a rutas internas y entrega contratos JSON 401/403. S14 dispone de `StatusNotice`, `LoadingBlock`, foco visible y controles bloqueados durante mutaciones. Sin embargo, los clientes de empleado, responsable y administración interpretan los fallos de `fetch` de forma distinta: algunos sólo muestran el texto de servidor, otros convierten carga en una lista vacía y ninguno establece un contrato transversal para sesión vencida, denegación, reintento y restauración de foco. El resultado es una ambigüedad observable, no un cambio de dominio.

| Estado | Conducta aprobable | Recuperación | Datos y seguridad |
| --- | --- | --- | --- |
| Carga inicial | Reserva el bloque de contenido, `aria-busy` y `LoadingBlock` anunciable; no usa un spinner como contenido estable. | Espera explícita; no reinicia filtros ni formulario. | No renderiza resultados de ámbito previo. |
| Vacío confirmado | Explica que no hay elementos dentro del ámbito y filtro actuales. | Permite cambiar filtros o volver, si ya existen. | Nunca deduce que un recurso ajeno no existe. |
| Error recuperable | Aviso textual con mensaje seguro, `correlationId` sólo si el contrato ya lo entrega y una única acción «Reintentar». | Repite sólo la lectura o la misma mutación idempotente; conserva valores, filtros y selección. | No revela stack, URL, permiso, centro ni recurso. |
| Éxito | Confirmación breve, textual y no dependiente del color. | Mantiene la vista y actualiza únicamente datos confirmados. | No trata una respuesta cliente como autorización adicional. |
| Sesión vencida (401) | Aviso específico: «Tu sesión ha finalizado. Vuelve a acceder para continuar.» y enlace seguro al login. | El login usa únicamente `loginHref`/`safeReturnTo`; tras acceso vuelve a la ruta privada permitida, no reintenta una mutación por sí solo. | No conserva contraseñas, TOTP, tokens ni datos de otra sesión. |
| Denegación (403/404 opaco) | Aviso genérico: «No puedes acceder a esta información o ya no está disponible.» | Volver al inicio del rol o a la ruta anterior segura; sin botón de reintento para forzar autorización. | Respuesta y copy no enumeran empresa, centro, persona, permiso ni existencia. |
| Conflicto/idempotencia (409) | Explica que la acción puede haberse registrado y pide revisar el resultado antes de repetir. | Recarga contextual de lectura; sólo reenvía con la misma clave cuando el contrato de esa mutación lo avale. | No crea una nueva clave ni duplica fichaje, decisión o solicitud. |

## Alcance propuesto para una implementación posterior

1. Un adaptador de respuesta de interfaz, compartido por clientes que ya consumen JSON, clasifica 401, 403/404 opaco, conflicto y error recuperable sin modificar las respuestas de servidor.
2. Un componente de recuperación del catálogo S25 presenta aviso, acción contextual y destino seguro; cada vista conserva el foco anterior si sigue montado o lo mueve al encabezado del aviso después de un fallo. El aviso debe tener `tabIndex={-1}`, ser enfocable programáticamente y usar `role="alert"` para error/denegación o `role="status"` para carga/éxito.
3. Lecturas en empleado, responsable y administración conservan filtros, selección y resultados ya confirmados mientras se recargan. Ninguna lectura fallida se presenta como vacío.
4. Cada mutación conserva el formulario y el foco del control activador. Sólo podrá exponerse «Reintentar» si el endpoint ya exige idempotencia y el cliente conserva la misma clave y payload. 401, 403 y 409 no reintentan automáticamente.
5. Las rutas protegidas de S19 siguen siendo la frontera de navegación; este trabajo no convierte una respuesta API en redirección automática ni sustituye autorización de servidor.

## Matriz de alcance por rol y carriles independientes

| Rol/rutas ya existentes | Incluir en la futura auditoría | No incluir |
| --- | --- | --- |
| Empleado: jornada, historial, correcciones y solicitudes | carga, lectura vacía, mutación idempotente, 401/403 y foco | política propia o geolocalización de #79/#80 |
| Responsable: centro, equipo, correcciones y solicitudes | carga concurrente, error de ámbito, decisión y foco | modelo de ausencias, tipologías o versiones de #89 |
| Administración: resumen, plantilla/jornadas, correcciones y configuración | filtros, carga/recarga, lectura denegada y estado de foco | cambios de permisos, configuración de módulo, exportación o datos fuera de ámbito |
| Login/MFA | retorno seguro después de 401 y mensaje de sesión vencida | recuperación de contraseña, cambio de sesión, TOTP o telemetría |

Esta historia no modifica ni anticipa los contratos de #79 (política efectiva propia) ni #89 (tipologías de ausencia). Es un patrón transversal para rutas ya autorizadas; cualquier estado propio de esos dominios queda en sus historias.

## Decisiones que requiere el PO antes de código

1. Aprobar el copy de sesión vencida y denegación genérica, incluido si 404 se agrupa con 403 para no enumerar recursos.
2. Confirmar el inventario inicial de mutaciones idempotentes y que el reintento visible conserva la misma clave: fichaje, decisión de corrección, solicitudes y cancelación sólo cuando su contrato lo permite. Las mutaciones sin esa garantía se recuperan revisando el resultado, no reenviando.
3. Aprobar tamaño **M** y que el primer corte se limite a rutas existentes de empleado, responsable, administración y login, sin nuevas rutas ni cambios de API.

Mientras estas decisiones estén pendientes, la recomendación es **no implementar UI ni flujos**. La rama sólo documenta el refinamiento.

## Criterios de aceptación propuestos

- Una lectura 401 ofrece acceso al login con retorno interno permitido; no muestra datos retenidos de la sesión anterior ni reejecuta mutaciones tras autenticarse.
- Una lectura o mutación 403/404 opaco comunica una denegación no reveladora, conserva aislamiento de rol/datos y no ofrece reintento de privilegio.
- Un fallo recuperable conserva formulario, filtros, selección y foco; el aviso se anuncia y el reintento es único, contextual y seguro.
- Carga, vacío, error, éxito, conflicto, sesión vencida y denegación se distinguen por texto además de color, sin saltos evitables ni dependencia de animación.
- Teclado, foco, lector de pantalla, `prefers-reduced-motion` y 320/390/768/1280 px se verifican con datos sintéticos; no hay E2E adicional mientras no cambie UI.
- Se añaden contratos para la clasificación HTTP y regresiones por rol; la suite completa, TypeScript y revisión visual/E2E sólo se ejecutan si la aprobación activa implementación UI. Docker queda encendido al pasar esa UI a revisión.

## Riesgos, exclusiones y puerta S15

El riesgo principal es presentar un reintento como inocuo y duplicar una mutación, u ocultar una denegación que corresponde a autorización real. La mitigación es una clave idempotente estable por intento, relectura antes de repetir conflictos y servidor como única autoridad. Quedan excluidos telemetría, reintentos silenciosos o infinitos, notificaciones, cambio de permisos o sesión, captura de soporte, datos sensibles, nuevos endpoints y cambios de auditoría de dominio.

Todo diseño, prueba y eventual implementación usa datos sintéticos. S15 conserva íntegro el **NO-GO para datos reales**; esta historia no aporta evidencia de TLS/WAF, retención, DPO, asesoría laboral, backups ni aprobación de despliegue.

## Validación de este refinamiento

Revisión estática de S14/S19, catálogo S25 y clientes actuales de empleado, responsable y administración. Se identificó mejora acotada y se documentaron los contratos que faltan; no se cambió código ni UI, por lo que no corresponde E2E ni arranque Docker en esta fase.
