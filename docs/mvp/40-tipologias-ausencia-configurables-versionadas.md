# S40 / HU-TC-040 — Tipologías de ausencia configurables y versionadas

**Estado:** refinamiento / no lista para desarrollo. **Issue:** [#89](https://github.com/JuanRubiio/TimeControlApp/issues/89). **Épica:** [#88](https://github.com/JuanRubiio/TimeControlApp/issues/88). **Dependencias:** ADR-0008, #46, #83, #88, S10, S14 y S15. **Tamaño propuesto:** M. No autoriza migraciones, rutas, UI, datos reales, saldo, adjuntos, reglas automáticas, nómina ni cambios en fichaje o cálculo.

## Problema e hipótesis

Como **Administración autorizada de una empresa con `leave_management` configurado**, quiero seleccionar qué tipologías operativas no sensibles están disponibles y publicar versiones fechadas, para que las solicitudes sintéticas mantengan un significado histórico estable sin que TimeControl clasifique derechos laborales.

La hipótesis es que una configuración limitada, revisable y visible evita reutilizar una etiqueta retirada o renombrada como si describiera el pasado. La alternativa menos intrusiva sigue siendo el canal externo de la organización: si necesita motivos, documentos, categorías legales o información sensible, el caso no entra en TimeControl.

## Alcance propuesto

- Administración prepara una **versión de catálogo** por empresa: conjunto ordenado de claves de un catálogo cerrado y copy visible aprobado; no hay alta de claves, texto libre ni importación.
- Una versión pasa por `draft → published → superseded` o `draft → discarded`. Sólo una versión puede estar publicada por empresa y módulo en un instante; publicar una nueva no reescribe ni borra la anterior.
- La solicitud nueva sólo puede elegir una clave presente en la versión publicada y conserva una instantánea de `typeKey`, etiqueta visible, versión y fecha de publicación. Retirar una clave de una versión posterior impide seleccionarla en solicitudes nuevas, pero no cambia las solicitudes ya creadas.
- La configuración es posible sólo con `leave_management` en `configured` o `active`; crear solicitudes exige además que el módulo esté `active`, RBAC, ámbito, relación vigente y validación de dominio conforme al ADR-0008.
- La persona empleada y el Responsable ven en una solicitud sólo la instantánea que su ámbito ya autoriza. La tipología no altera los estados `pending`, `approved`, `rejected` o `cancelled`, ni la decisión humana.

## Exclusiones no negociables

- No se crean vacaciones, bajas, permisos retribuidos, derechos, motivos legales, convenios, saldo, bolsa de horas, límites, cómputos, sustituciones, cobertura ni estadísticas de absentismo.
- No hay campos libres, comentarios, adjuntos, justificantes, documentos, diagnósticos, datos de salud, embarazo, discapacidad, violencia, afiliación sindical, personas dependientes, retribución, geolocalización ni datos de terceros.
- No hay aprobación automática, reglas de elegibilidad, alertas, notificaciones, importación, exportación, IA ni integración externa.
- No se escribe ni lee `time_events`, correcciones S6, reglas S3, cálculos S5, jornada prevista, nómina o datos reales. Una aprobación sigue significando sólo una decisión operativa registrada.

## Catálogo y modelo candidatos

La configuración no es un editor de categorías. El catálogo inicial propuesto contiene únicamente claves neutras, pendientes de aprobación explícita del PO, DPO y asesoría laboral:

| Clave estable | Etiqueta candidata | Uso permitido |
| --- | --- | --- |
| `general_request` | Solicitud general | Petición operativa sin afirmar derecho. |
| `personal_management` | Gestión personal | Etiqueta genérica; no recoge motivo. |
| `availability_adjustment` | Ajuste de disponibilidad | Sólo comunicación operativa; no cambia turno ni jornada. |

Una versión candidata contiene `id`, empresa resuelta en servidor, número monotónico, estado, claves ordenadas, copy de advertencia aprobado, actor e instantes UTC. La persistencia futura no guarda una causa, comentario ni contenido de la solicitud dentro de la configuración. Las versiones y sus publicaciones son append-only; un fallo o la retirada se representa por un nuevo estado y motivo-código de catálogo, nunca por borrar historia.

Los eventos/auditoría futuros sólo pueden referenciar empresa autorizada, versión, claves afectadas, transición, actor, instante y correlación. No incluyen etiquetas que el administrador pudiera haber escrito, motivos de solicitud ni datos de personas afectadas.

## Autorización, errores y experiencia

Administración necesita permisos explícitos, propuestos como `leave-type.read:company` y `leave-type.configure:company`; no se conceden por el nombre del rol. Empleado y Responsable no pueden publicar, retirar ni enumerar la configuración de otra empresa. El servidor resuelve empresa, módulo y ámbito antes de cualquier lectura o mutación; la URL directa recibe una denegación genérica cuando el módulo no está activo o el ámbito no autoriza.

La futura pantalla administrativa debe usar el catálogo existente, estados textuales y una vista de diferencias entre borrador y versión publicada. Debe explicar que las etiquetas no describen derechos ni justifican una ausencia, y señalar el canal externo para casos sensibles. Antes de desarrollar UI, UX debe aprobar estados de carga, vacío, conflicto de publicación, sesión caducada, éxito, móvil, foco, teclado y lector de pantalla. No se diseña ni activa aún una pantalla.

## Criterios de aceptación para una historia posterior

1. Dado un módulo `configured` y Administración autorizada, cuando prepara un borrador con una o más claves del catálogo aprobado, entonces puede revisarlo sin que Empleado o Responsable lo vean.
2. Dado un borrador válido y una decisión de publicación, cuando se publica, entonces queda una versión inmutable y se conserva la versión previa como `superseded`.
3. Dada una solicitud creada con una versión publicada, cuando una versión posterior retira o cambia el orden de una clave, entonces la lectura histórica conserva su instantánea y la clave retirada no puede usarse en nuevas solicitudes.
4. Dado un módulo `disabled`, `paused`, empresa ajena, relación no vigente o permiso ausente, cuando se intenta una ruta directa o mutación, entonces el servidor deniega sin enumerar configuración ni solicitudes ajenas.
5. Dada una carga con clave desconocida, duplicada, vacía, campo inesperado, intento de texto libre o publicación concurrente, cuando se valida, entonces falla de forma explícita e idempotente sin modificar la versión publicada.
6. Dada cualquier publicación, retirada o solicitud, entonces no se crean efectos en fichajes, correcciones, cálculo, planificación, saldo, exportación o nómina; fixtures, trazas y E2E usan sólo datos sintéticos.

## Riesgos, dependencias y puerta de decisión

| Dimensión | Nivel | Mitigación / revisión requerida |
| --- | ---: | --- |
| Laboral y legal | Alto | PO y asesoría laboral validan que las tres etiquetas neutras no se interpreten como derecho, permiso o clasificación legal. |
| Privacidad | Alto | DPO valida catálogo cerrado, copy, canal externo y ausencia de campos sensibles antes de ampliar categorías o usar datos reales. |
| Seguridad | Medio | S1/S2 y propietario de módulos acuerdan permisos, empresa efectiva, denegación por URL directa, auditoría e idempotencia. |
| UX y accesibilidad | Medio | UX/QA revisan selector, comparación de versiones, errores y cuatro anchos antes de implementar interfaz. |
| Operación | Alto | S15 conserva el NO-GO de datos reales, retención definitiva, despliegue y operación. |

**Decisiones pendientes de PO:** aprobar o rechazar el catálogo inicial; confirmar si `personal_management` y `availability_adjustment` son comprensibles sin inducir una declaración sensible; decidir el titular del copy y del canal externo. Hasta esas decisiones y las revisiones DPO/laboral, S1/S2/módulos, UX y QA, #89 permanece en **Refinamiento** y no satisface la Definition of Ready.

## Plan de evidencia si se autoriza implementación

- Contrato, unitarias e integración: versión única publicada, serialización de publicación, instantánea, retirada, idempotencia, aislamiento de empresa y relación/centro efectivo.
- Negativas: claves no aprobadas, duplicadas o vacías; texto libre/campos extra; módulo en cada estado; RBAC y URL directa; carreras y errores recuperables.
- E2E manual sintética: Administración prepara/publica; Empleado crea con una clave permitida; Administración publica una nueva versión que retira la clave; las solicitudes históricas permanecen legibles. Comprobar 320/390/768/1280 px, teclado y lector de pantalla.
- Mantener el contenedor de revisión probado encendido antes de pasar una futura historia de interfaz a `En revisión`; no hay contenedor que validar en este refinamiento documental.

## Alternativas descartadas

- **Etiquetas libres por empresa:** permitirían codificar salud, causas legales o datos de terceras personas sin revisión.
- **Actualizar el nombre de una tipología en solicitudes antiguas:** destruye la explicación histórica y dificulta auditoría.
- **Asociar una tipología a saldo o fichaje:** convierte una solicitud de RR. HH. en regla de jornada sin contrato de sus propietarios.
- **Activar el módulo al publicar una versión:** mezcla configuración con adopción empresarial y elude la puerta `configured → active` del ADR-0008.
