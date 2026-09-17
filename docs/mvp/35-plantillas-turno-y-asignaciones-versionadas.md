# HU-TC-037 — Plantillas de turno versionadas e instantáneas por asignación

**Estado:** propuesta de diseño para PO, asesoría laboral, UX, privacidad y QA. **Issue:** [#85](https://github.com/JuanRubiio/TimeControlApp/issues/85). **Dependencias:** #83, #84, S2, S3, S10, S14 y S15. No autoriza migración, ruta, cuadrante, datos reales ni cambios al cálculo actual.

## Contexto y límite con S3

S3 ya es propietaria de `shifts`, `rule_versions`, calendario, zona IANA y la instantánea que usa una regla publicada. Un turno creado o una regla publicada no equivale a una asignación individual de planificación: no expresa para qué persona y rango concreto se preparó una jornada.

Esta historia introduce sólo el contrato futuro de esa asignación. No cambia el resultado de `RuleResolver`, `ResolvedRule`, `publishedWorkdayForEmployee`, cálculo S5 ni la vista de jornada publicada S23. Antes de que una asignación se use como fuente de previsto, #84 deberá acordar una enmienda explícita con S3/S5; ningún consumidor puede decidir su propia prioridad ni leer tablas internas.

## Modelo propuesto

### Plantilla de turno

Una **plantilla** es una definición reutilizable y empresarial de jornada. Tiene un nombre visible, zona IANA, segmentos, minutos esperados, versión, estado y vigencia de uso futuro. Sus segmentos reutilizan las invariantes S3: formato horario válido, sin solapes, jornada partida y cruce de medianoche sólo cuando S3 lo admite. No incorpora primas, salario, convenio, disponibilidad ni interpretación legal.

Una plantilla puede estar `draft`, `published` o `retired`:

- `draft`: Administración puede revisar la versión sin usarla en asignaciones publicadas.
- `published`: puede originar una nueva asignación futura.
- `retired`: impide nuevas asignaciones; conserva la lectura de versiones y asignaciones existentes.

Editar una plantilla publicada no la modifica: crea una versión posterior. La nueva versión no actualiza ninguna asignación ya creada.

### Asignación de jornada prevista

Una **asignación** vincula una relación laboral vigente a una instantánea completa de una versión de plantilla y a un intervalo semiabierto `[effectiveFrom, effectiveTo)`. La instantánea contiene nombre de plantilla, versión, zona IANA, segmentos y minutos esperados tal y como existían al asignar; no conserva el identificador mutable como fuente de verdad.

La asignación tiene estado `draft`, `published`, `cancelled` o `superseded`:

- `draft`: propuesta no visible para la persona empleada ni fuente de ningún cálculo.
- `published`: referencia operativa futura, visible sólo cuando #84/S23 acuerden su presentación.
- `cancelled`: revocación de una asignación futura; conserva el motivo-código y no borra su auditoría.
- `superseded`: asignación futura reemplazada expresamente por otra, con referencia de correlación; no se recorta ni divide automáticamente.

No se puede publicar, cancelar ni sustituir una asignación cuyo inicio ya haya transcurrido sin una historia posterior de corrección y revisión humana. Este contrato no permite editar retroactivamente una planificación ni rellenar fichajes.

## Autoridad propuesta

| Actor | Puede | No puede |
| --- | --- | --- |
| Administración | Crear, versionar y retirar plantillas; habilitar cada versión para centros autorizados; revisar conflictos. | Reescribir una instantánea publicada, publicar fuera de relación vigente o modificar evidencia de fichaje. |
| Responsable | Publicar asignaciones futuras sólo para relaciones vigentes de sus centros y con plantillas habilitadas por Administración. | Crear o editar plantilla global, publicar fuera de ámbito, usar una plantilla no habilitada o autoasignarse. |
| Empleado | Consultar sólo una jornada publicada propia cuando exista la vista autorizada. | Crear, aceptar, editar o rechazar turnos; consultar a terceras personas. |

**Decisión PO aprobada (2026-09-17):** el Responsable publica la asignación. La segregación se conserva separando el catálogo empresarial (Administración) de la publicación operativa por centro (Responsable), verificando servidor, relación vigente, centro autorizado, plantilla habilitada, solape y auditoría.

## Validación de intervalo y conflicto

Antes de publicar, el servidor resuelve empresa, centro, relación laboral y vigencia por S2. Rechaza el intervalo que:

1. empiece antes de la relación, termine después o no tenga días efectivos;
2. use una plantilla no publicada o retirada;
3. solape una asignación `published` de la misma relación;
4. intente construir un tramo inválido frente a las reglas S3 de zona, medianoche, DST o solape interno.

Un conflicto devuelve las fechas y el tipo de conflicto mínimos necesarios para el actor autorizado. Nunca se resuelve cortando, fusionando, desplazando, borrando ni priorizando automáticamente otra asignación. La persona usuaria elige cancelar o sustituir una asignación futura mediante una nueva operación autorizada y auditada.

## Auditoría, privacidad y presentación

Crear plantilla/versionar, crear borrador, publicar, cancelar, sustituir y rechazar un conflicto generan eventos append-only con actor, relación, centro, intervalo, versión/instantánea, estado anterior/nuevo, motivo-código y correlación. No incluyen texto libre, fichajes, saldo, motivo de ausencia, ubicación, nómina ni contenido de terceras personas.

El futuro cuadrante debe distinguir por semántica y texto `borrador`, `publicado`, `conflicto` y `sin asignación`; no depende sólo de color. La rejilla tendrá alternativa lineal para móvil y tecnología asistiva. El empleado recibe información de su propia publicación, no de cobertura, disponibilidad, rendimiento ni decisiones internas de equipo.

## Integración futura y pruebas

La historia de implementación futura será propietaria de tablas y un puerto explícito, por ejemplo `PlannedScheduleResolver`. Deberá recibir identidad laboral ya autorizada e instante de servidor; no aceptará `employeeId`, empresa, centro, plantilla o zona desde el navegador como autoridad.

Antes de implementar se necesitan pruebas unitarias y PostgreSQL para versión inmutable, intervalo semiabierto, conflicto, sustitución futura, relación terminada, centro ajeno, medianoche/DST y auditoría. E2E sintética cubre Administración, Responsable y Empleado, URL directa denegada, vacío, carga, error, teclado, lector de pantalla y 320/390/768/1280 px. S15 conserva el NO-GO para datos reales.

## Alternativas descartadas

- **Editar turnos o reglas existentes en sitio:** reescribe el contexto histórico de una asignación.
- **Asignar una plantilla por referencia mutable:** un cambio posterior altera el pasado sin evidencia.
- **Resolver solapes automáticamente:** toma una decisión de planificación sin criterio humano ni explicación.
- **Usar directamente la asignación en S5/S23:** cambia fuentes de cálculo/publicación sin acuerdo de sus sesiones propietarias.
- **Permitir que Responsable publique fuera de su centro o con una plantilla no habilitada:** elude la separación aprobada entre catálogo administrativo y publicación operativa por centro.

## Criterios de salida

1. PO confirma la autoridad de publicación y el catálogo inicial de estados.
2. Asesoría laboral valida que previsto no se presenta como orden, derecho, nómina o interpretación de convenio.
3. S3/S5 aceptan o enmiendan la frontera de integración antes de que #84 use una asignación como fuente.
4. Privacidad, UX y QA aprueban mínimo de auditoría, rechazo de conflicto y alternativa accesible de cuadrante.
5. La implementación se abre como historia independiente tras esas decisiones y después de que el módulo `shift_planning` esté activo conforme al ADR-0008.
