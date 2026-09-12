# S16 — Configuración y exportación guiadas para piloto asistido

**Estado:** configuración guiada completada con datos sintéticos; exportación visible bloqueada hasta el cierre verificable de S15. **Tamaño:** M. **Dependencias:** S2, S3, S8, S9, S14 y cierre de almacenamiento de S15.

## Nombre y objetivo

Exponer en UI, sin nuevas reglas de negocio, el alta/configuración mínima y la solicitud/descarga de exportaciones que ya existen por API. El objetivo es que el piloto mida el producto y no dependa de peticiones técnicas para operaciones rutinarias.

## Entregable verificable

Checklist de configuración de empresa con progreso honesto y formularios autorizados de empresa, centro, empleado, relación, calendario/regla/versiones vigentes; flujo de exportación CSV/PDF por persona o centro/período, con estado, vencimiento y mensajes de autorización. No habrá importación masiva.

## Alcance y exclusiones

Consume los contratos existentes de S2/S3/S9 y sus validaciones servidor. Incluye filtros/búsqueda de plantillas cuando el volumen lo requiera para operar los datos existentes. Excluye CSV/Excel de entrada, alta masiva, cambios retroactivos de reglas, conectores, vacaciones/ausencias, cierre de período, notificaciones, nómina, convenios, portal de asesoría y acceso de soporte por defecto.

## Dominios, rutas, módulos, tablas y documentación afectados

Propietaria de rutas/componentes administrativos de configuración y exportación, adaptadores UI de S2/S3/S9, pruebas de ruta y guía de piloto. Consume `/companies`, `/sites`, `/employees`, `/employments`, `/work-rules`, `/rule-versions`, `/calendars`, `/shifts`, `/exports` y descarga. No cambia tablas, permisos, APIs, cálculo ni auditoría; todas las mutaciones y descargas conservan autorización de servidor.

## Dependencias y paralelismo

Depende del sistema visual y componentes de S14; la descarga depende de que S15 cierre retención/almacenamiento. Puede preparar formularios de configuración en paralelo con S15, evitando editar simultáneamente componentes compartidos de S14. No puede ejecutarse en paralelo con otra sesión que posea las mismas rutas `admin/*` sin acuerdo.

## Riesgos legales, técnicos y de integración

Una UI podría inducir a pensar que una regla configura cumplimiento automático, permitir cambios de vigencia confusos o hacer exportaciones demasiado amplias. Mitigación: copy de límites, confirmación de vigencia, servidor como autoridad, alcance obligatorio de exportación, auditoría existente y pruebas RBAC. No se presentan saldos como nómina.

## Criterios de aceptación

- Administrador autorizado completa la configuración mínima con campos y errores comprensibles; cada paso refleja datos confirmados por API, sin inventar progreso.
- Versiones de regla/calendario muestran vigencia y no permiten sobrescribir historia; cualquier incompatibilidad la rechaza el servidor y la UI la explica.
- Responsable sólo ve y opera su ámbito; empleado no alcanza configuración ni exportación no autorizada, incluso navegando por URL/API.
- La exportación exige persona o centro y período, informa de generación, descarga autenticada y vencimiento; no crea enlaces públicos.
- La guía y ayuda contextual distinguen registro, configuración revisable y asesoría laboral; no prometen cumplimiento ni interpretación de convenios.
- Pruebas de autorización, validación, estados vacíos/error/carga, descarga expirado y regresión S2/S3/S8/S9 pasan con datos sintéticos.

## Pruebas necesarias

E2E de administrador/responsable/empleado, validación de vigencias, búsqueda/filtros, exportación CSV/PDF autorizada, expiración, accesibilidad y responsive conforme a S14. Validar que auditoría de las mutaciones/descargas sigue presente.

## Decisiones que requieren aprobación

1. Confirmar que S16 es condición de piloto o que se acepta explícitamente un piloto asistido con operación técnica limitada.
2. Definir campos mínimos de alta y quién valida calendario/regla antes de invitar empleados.
3. Aprobar que importación CSV/Excel, notificaciones, ausencias y cierre de período permanecen fuera de S16.

## Plan de ejecución S16 — 12/09/2026

Base: `master` `747e1ae`, rama `codex/s16-configuracion-guiada`. Las dependencias S2, S3, S8, S9, S14 y las referencias S17–S20 están integradas en esta base. La regresión previa con fixtures exclusivamente sintéticos finalizó correctamente: `docker compose run --rm --no-deps app npm test` — 98 pruebas en 29 ficheros.

- Crear `src/configuration/{api,components}.tsx` y `src/app/admin/configuration/page.tsx`: checklist honesto y formularios de empresa, centro, persona, relación, calendario, turno, regla y versión, sobre las APIs existentes.
- Añadir sólo el enlace mínimo de navegación desde `src/admin/components.tsx`; no se cambiarán tablas, migraciones, contratos HTTP, RBAC, cálculo, auditoría ni almacenamiento.
- Añadir `tests/configuration-ui.test.ts`; ejecutar TypeScript, pruebas dirigidas y regresión Docker. La comprobación visual abarcará los anchos S14 y controles etiquetados/estados anunciables. Las pruebas de permisos conservarán las denegaciones del servidor para empleado y ámbitos ajenos.
- La UI de descarga/exportación queda expresamente fuera de esta entrega: S15 no documenta aún el cierre verificable de almacenamiento aislado, vencimiento, borrado controlado y auditoría exigido por S16/S20.

## Cierre de configuración guiada — 12/09/2026

### Alcance completado

- Nueva ruta protegida `/admin/configuration`, enlazada desde Administración, con checklist de progreso calculado exclusivamente a partir de respuestas confirmadas por API.
- Formularios guiados para empresa, centro, persona, relación laboral, calendario, turno opcional, regla y versión vigente. Los formularios consumen sin modificar los contratos S2/S3; el servidor sigue validando datos, vigencias, ámbito, RBAC y auditoría.
- Copy visible: pausas manuales y visibles, versiones históricas no sobrescribibles, reglas revisables con asesoría y ausencia de promesa de cumplimiento automático. No se solicita PII adicional.
- La ruta exige en servidor permisos de configuración; una persona empleada o responsable sin permisos de escritura se redirige antes de renderizarla. Las APIs mantienen sus denegaciones y validación de ámbito en servidor.

### Archivos afectados

- `src/configuration/api.ts`, `src/configuration/components.tsx` y `src/app/admin/configuration/page.tsx`.
- Cambio mínimo de navegación en `src/admin/components.tsx`.
- `tests/configuration-ui.test.ts`, este contrato, `README.md` del MVP y guía de usuario del piloto.

### Pruebas y resultados reales

- Antes del cambio: `docker compose run --rm --no-deps app npm test` — **98 pruebas en 29 ficheros**, correctas.
- Tras el cambio: build Docker de producción correcto; la ruta `/admin/configuration` queda incluida. Conserva cinco advertencias existentes de S19/S9 sobre Edge y acceso dinámico a ficheros de exportación, fuera del alcance S16.
- Dirigidas: `docker compose run --rm --no-deps app npx vitest run tests/configuration-ui.test.ts tests/admin-ui.test.ts tests/company-people.test.ts tests/work-rules.test.ts tests/exports.test.ts tests/permissions.test.ts` — **19 pruebas**, correctas.
- Regresión completa final: `docker compose --project-name time-control-s16-p2 --env-file .local/s16-p2.synthetic.env run --rm --no-deps app npm test` — **103 pruebas en 30 ficheros**, correctas.
- TypeScript: `docker compose run --rm --no-deps app npx tsc --noEmit` — correcto. La UI usa etiquetas asociadas, estados `status`/`alert`, controles nativos y los estilos responsive/foco de S14; se validó su inclusión en el build. La comprobación manual de lector de pantalla/zoom pertenece al cierre humano de S15 y no se declara automatizada.
- P2 repetido en `time-control-s16-p2`: migración y `seed:demo` con perfil `office` sintético correctos; administración obtuvo 6/6 pasos, creó una persona sintética y recibió confirmación de servidor/auditoría. Responsable y empleado recibieron `307` al navegar directamente a configuración; el responsable conservó lectura de relaciones de su ámbito (`200`) y empleado recibió `403`. En 320, 390, 768 y 1280 px no hubo desbordamiento horizontal y se conservó el aviso de exportación bloqueada. No se usaron datos reales.

### Riesgos, bloqueos y decisiones pendientes

- Corrección mínima documentada de S2: el entorno sintético P2 reveló que `GET /employments` fallaba con `column reference "id" is ambiguous`. Se calificó sólo la proyección de su consulta de lectura y se añadió regresión; no cambia tablas, permisos ni contrato HTTP.
- **Bloqueo S15:** no se muestra solicitud, descarga, URL ni enlace público de exportación hasta evidenciar almacenamiento aislado, vencimiento, borrado físico controlado y auditoría. La API S9 existente no se altera.
- No hay migraciones ni cambios de tablas, RBAC, APIs, cálculo, eventos o auditoría. No se introducen importación CSV/Excel, notificaciones, ausencias, cierre de período, nómina, convenios, datos reales ni mecanismos de vigilancia.
- Permanece pendiente la decisión de producto sobre si esta configuración es condición de piloto y la validación de calendario/regla por la persona responsable y asesoría antes de invitar empleados.

### Corrección visual y de acceso por rol — 12/09/2026

- La ruta conserva la navegación completa de Administración (Resumen, Plantilla y jornadas, Correcciones, Configuración y cierre de sesión), que faltaba en la composición inicial y dejaba una columna lateral vacía.
- La configuración se reorganizó en bloques de Organización, Equipo y Jornada, con tarjetas de formulario, estado del entorno y estilos responsive para 1280, 768, 390 y 320 px. Los controles mantienen etiquetas nativas, foco visible y no se modificaron APIs, tablas, auditoría ni RBAC.
- El ámbito de una regla ya muestra exclusivamente empresa o centros según el tipo elegido, evitando seleccionar un identificador incompatible antes de que el servidor valide la creación.
- Integración mínima con S19: el destino de acceso sin `returnTo` pasa a ser `/admin` para administración, responsable y auditor, y `/employee` para empleado; un `returnTo` interno permitido conserva prioridad. La sesión, RBAC y aislamiento siguen verificándose en servidor. La exportación continúa bloqueada por S15.
