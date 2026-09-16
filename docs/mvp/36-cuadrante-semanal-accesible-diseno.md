# HU-TC-038 — Cuadrante semanal accesible por centro autorizado

**Estado:** propuesta de diseño para PO, UX y QA. **Issue:** [#86](https://github.com/JuanRubiio/TimeControlApp/issues/86). **Dependencias:** #83, #84, #85, S14 y S19. No autoriza tablas, API, ruta, operaciones de planificación, arrastrar y soltar, publicación ni cambios a la jornada publicada.

## Propósito y frontera

Esta historia define cómo se presentaría a una persona Responsable un cuadrante semanal de su centro autorizado. Es una visualización futura de asignaciones ya resueltas: no crea una fuente de verdad ni infiere disponibilidad, cobertura, rendimiento o necesidad de personal.

La futura implementación consumirá un puerto explícito, por ejemplo `PlannedScheduleResolver`, con identidad ya autorizada e instante de servidor. No aceptará desde el navegador `employeeId`, centro, empresa, plantilla o zona como autoridad. Hasta que una historia posterior sea aprobada, ni este diseño ni la interfaz pueden alterar `RuleResolver`, `ResolvedRule`, S5 o S23.

## Alcance por actor

| Actor | Ve en este diseño | No ve ni puede hacer |
| --- | --- | --- |
| Responsable | Sólo relaciones laborales vigentes de los centros que su permiso autorice y la semana consultada. | Personas de otro centro, datos de ubicación, ausencias, saldo, productividad, fichajes o datos de empleo no necesarios. |
| Administración | No recibe una vista alternativa en esta historia. Su gestión de plantillas y publicación conserva la separación acordada en #85. | Usar el cuadrante para modificar una asignación o saltarse el control de ámbito. |
| Empleado | No consume el cuadrante de equipo; sólo podrá consultar su propia publicación mediante la superficie explícita que acuerde #84/S23. | Ver turnos, cobertura o decisiones del resto del equipo. |

Un acceso directo sin sesión, con sesión caducada, módulo inactivo o ámbito no autorizado muestra la respuesta genérica del catálogo UI. No enumera centros, personas ni módulos disponibles.

## Estructura propuesta

1. **Contexto de consulta.** Título “Cuadrante semanal”, centro autorizado seleccionado y semana en formato local. Si sólo existe un centro autorizado se informa de cuál es, sin ofrecer una falsa posibilidad de cambio.
2. **Navegación temporal.** Botones etiquetados “Semana anterior”, “Semana actual” y “Semana siguiente”. La fecha visible anuncia el intervalo completo; no se usa un selector de fecha sin contexto.
3. **Vista de tabla.** Una tabla semántica: primera columna para la persona y una columna por día. Cada celda contiene una única acción de consulta con texto completo, por ejemplo “Martes 17: Turno de tarde, publicado” o “Martes 17: sin asignación”. Nunca depende únicamente de color, icono o posición.
4. **Detalle de consulta.** Al activar una celda se abre un panel o bloque asociado con día, estado, nombre de plantilla, intervalo local y centro. No contiene controles de edición en esta historia.
5. **Resumen operativo.** El encabezado explica que es una planificación informativa. `Borrador`, `Publicado`, `Conflicto` y `Sin asignación` se muestran como texto más un estado visual del catálogo, sin convertir una publicación en orden laboral, nómina o decisión automática.

El mapa de foco sigue el orden de lectura: contexto, semana, tabla y detalle. La tabla mantiene encabezados `th` de fila y columna; al abrir un detalle el foco se conserva en la celda de origen al cerrarlo. No se exige arrastrar y soltar, selección múltiple ni interacción por puntero.

## Alternativa lineal y responsive

En pantalla estrecha o con ampliación, la tabla se sustituye por una lista lineal agrupada por persona: cada bloque anuncia el nombre mínimo necesario y presenta los siete días como acciones de consulta equivalentes. No hay desplazamiento horizontal obligatorio ni información disponible sólo en el modo de tabla.

La misma alternativa está disponible para lector de pantalla si la tabla no resulta eficaz. Debe conservar estado, orden de semana, detalle y mensajes de error, y funcionar con teclado en 320, 390, 768 y 1280 px. Los destinos táctiles, separación, tipografía, botones, selectores y estados de foco proceden exclusivamente del catálogo de componentes UX/UI vigente.

## Estados y mensajes

| Situación | Respuesta de la interfaz |
| --- | --- |
| Carga | Estructura estable con esqueletos breves; no se reemplaza toda la página ni se pierde el foco. |
| Sin asignaciones | Mensaje “No hay asignaciones para esta semana en tu ámbito autorizado”, sin sugerir que el equipo esté disponible. |
| Borrador | Se identifica como no publicado y sólo para consulta de quien esté autorizado; no se muestra al empleado. |
| Conflicto | Explica que la planificación requiere revisión y muestra sólo el mínimo día/persona permitido; no propone resolverlo automáticamente. |
| Error recuperable | Mensaje del catálogo y un reintento explícito que no altera semana ni centro seleccionados. |
| Sesión expirada o denegación | Mensaje genérico y ruta segura, sin detalles de autorización ni enumeración de datos. |

El refresco de datos no muestra una pantalla de “recargando” ni desmonta la vista ya confirmada. Conserva semana, centro, foco y contenido válido hasta que llegue una respuesta posterior; sólo la zona que cambia puede usar estado de espera.

## Preparación para una implementación posterior

La implementación deberá confirmar que el módulo `shift_planning` está activo conforme al ADR-0008 y que el servidor filtra centro, relación vigente y semana antes de devolver filas. Las acciones de crear borrador, publicar, cancelar o sustituir continúan fuera de alcance: la segregación de funciones de #85 no se relaja por existir una rejilla.

La batería futura incluirá autorización de centro y URL directa, fila de relación terminada, semana vacía, estados borrador/publicado/conflicto, error y reintento, sesión caducada, teclado, foco al detalle, lector de pantalla, alternativa lineal y los cuatro anchos. S15 conserva el NO-GO para datos reales.

## Decisiones pendientes y salida

1. PO confirma si la primera versión es estrictamente de consulta para Responsable y mantiene a Administración como publicadora.
2. UX valida tabla semántica, alternativa lineal, foco, copy y componentes del catálogo.
3. QA valida el plan de pruebas de autorización, estados y accesibilidad antes de abrir implementación.
4. Cualquier cambio de fuente para S3/S5/S23, operación de planificación o visibilidad de empleado requiere una historia y aprobación separadas.

## Alternativas descartadas

- **Cuadrante sólo visual basado en `div` y color:** pierde cabeceras, lectura semántica y equivalencia con teclado.
- **Arrastrar y soltar obligatorio:** excluye teclado y añade una operación de planificación no aprobada.
- **Una vista para toda la empresa:** rompe el ámbito autorizado del Responsable.
- **Recarga total al cambiar semana o al refrescar:** provoca parpadeo, pérdida de foco y falsa percepción de navegación incompleta.
