# Guía operativa de delivery interno por historias

**Estado:** aplicable cuando el propietario autorice la configuración del Kanban aprobado.
**Herramienta decidida:** GitHub Free — Projects + Issues, uso exclusivamente interno.
**No sustituye:** el [workflow Git](../development/git-workflow.md), los contratos MVP, S15 ni la autoridad humana para merge/despliegue.

## Para qué sirve

Esta guía convierte una necesidad de producto en una entrega trazable y revisada, sin transformar una sugerencia de agente en una decisión automática. El tablero muestra el estado del trabajo; el repositorio contiene código y documentación contractual. Ninguno se usa para datos reales de empleados, clientes, secretos o registros de jornada.

El trabajo no se inicia de forma autónoma. El propietario abre una sesión de Codex y ordena de manera explícita la fase que desea iniciar. En la fase inicial, esa orden es una sesión de discovery/backlog, no una sesión de implementación.

## Reglas que no cambian

- Sólo datos sintéticos, minimizados y necesarios en Issues, comentarios, prompts, adjuntos y pruebas.
- El propietario de producto (PO) es quien prioriza y aprueba alcance, riesgo y cierre de producto.
- Un agente puede investigar, proponer, implementar o revisar; no aprueba por sí mismo un cambio crítico, un merge, un despliegue ni una excepción.
- Una historia de alto riesgo no la revisa el mismo agente/persona que la implementó.
- El estado `Merged` no significa `Desplegada`; y `Desplegada` no autoriza datos reales. S15 y el Go/No-Go siguen prevaleciendo.
- El nombre de rama y las operaciones Git siguen el workflow vigente: `codex/<sesion>-<tema>`, commits pequeños, pruebas, publicación remota y PR.

Las puertas operativas reutilizables son: [Definition of Ready](definition-of-ready.md), [matriz de puertas de calidad](matriz-puertas-calidad.md), [registro de decisiones/riesgos](registro-decisiones-riesgos-excepciones.md), [encargo de sesión](plantilla-encargo-sesion.md) y [protocolo de incidente del proceso](protocolo-incidente-proceso.md).

## Cadencia mínima

| Momento | Participan | Resultado |
|---|---|---|
| Intake continuo | PO + analista | Idea breve, evidencia, riesgo inicial; aún no es compromiso. |
| Refinamiento semanal | PO, analista, arquitectura/UX/seguridad según riesgo | Historia verificable, exclusiones, dependencias y decisión preparada. |
| Planificación de entrega | PO + responsables | Selección limitada por WIP, responsables y bloqueos visibles. |
| Seguimiento breve | Quien trabaja la historia | Estado real, bloqueo y siguiente acción; no informe de actividad. |
| Revisión de PR | Implementador, QA/revisor y especialistas requeridos | Evidencia de pruebas, hallazgos resueltos o riesgo elevado. |
| Validación/cierre | PO + QA | Resultado frente a objetivo y aprendizaje reutilizable. |

No se inicia una nueva historia sólo para mantener ocupación: se respeta el WIP de la propuesta Kanban. Si hay una incidencia crítica, el PO decide qué historia se pausa y el motivo queda registrado.

## Arranque del modelo: discovery y backlog inicial

Antes de desarrollar historias, el PO abrirá una **sesión nueva de Codex de discovery y priorización**. El objetivo no es llenar el tablero indiscriminadamente ni construir producto; es producir un backlog inicial pequeño, fundamentado y gobernable.

### Entrada que inicia el flujo

El PO inicia manualmente la sesión con una petición equivalente a:

> Realiza una sesión de discovery y priorización de backlog para TimeControlApp. Lee los contratos MVP, el informe prepiloto, S13–S20 y la guía de delivery. No implementes, no configures GitHub ni conectes servicios. Propón un backlog inicial priorizado de épicas e historias, con evidencia, exclusiones, dependencias, riesgo, modelo de trabajo recomendado y decisiones que requieran mi aprobación.

La sesión recibe sólo documentación interna pertinente y datos sintéticos. Nunca se usa una conversación de cliente, un registro laboral real, una exportación ni un secreto como entrada directa. Si existe feedback externo, el PO/analista lo reduce previamente a un problema anonimizado y a evidencia mínima.

### Resultado esperado del discovery

Cada candidata queda como `Intake` y contiene: título/ID propuesto, épica, problema, usuario/rol, beneficio esperado, evidencia o hipótesis, prioridad propuesta, tamaño aproximado, dependencias, exclusiones, riesgo y la decisión que falta. El PO clasifica cada una en:

- **Obligatoria antes de piloto:** controles, evidencia o aprobaciones que bloquean datos reales; actualmente S15 conserva esta categoría y el NO-GO.
- **Valiosa para piloto:** mejora el aprendizaje o reduce soporte, sin adelantar una exclusión aprobada.
- **Posterior al piloto:** requiere evidencia de uso real o no es necesaria para validar la hipótesis actual.
- **Rechazada:** contradice un límite de producto, privacidad, coste o valor.
- **Pendiente de evidencia/decisión:** no se estima ni pasa a desarrollo hasta resolver la incógnita.

El backlog inicial debe ser deliberadamente limitado —orientativamente 10–20 candidatas, no una lista ilimitada— y mantiene fuera las exclusiones vigentes: geolocalización, biometría, cámara, vigilancia, nómina, interpretación automática de convenios, app nativa, conectores no aprobados, importaciones, notificaciones y otras capacidades aplazadas. Reabrir una exclusión exige una decisión de alcance independiente del PO y la revisión proporcional de privacidad, legal y arquitectura.

### Priorización y paso a ejecución

El PO revisa el resultado del discovery y decide qué candidatas se descartan, aplazan o pasan a `Refinamiento`. La siguiente sesión de Codex sólo recibe una historia priorizada; no el backlog entero por defecto. Tras el refinamiento y la aprobación del PO, se puede conservar la misma sesión para un cambio pequeño o abrir una sesión nueva de implementación. Para cambios medios/altos se recomienda separar:

1. Sesión de producto/análisis y contrato de historia.
2. Sesión de implementación, limitada a la historia aprobada y su rama.
3. Sesión de revisión independiente cuando el riesgo o la transversalidad lo requieran.

Esta separación reduce la contaminación de contexto y evita que quien propuso una solución la dé por válida sin contraste.

## Recorrido de una historia

### 1. Registrar Intake

El PO o analista crea un Issue con el identificador `HU-TC-XXX`, título, épica, necesidad, evidencia y posible riesgo. Aplica la [plantilla de historia](plantilla-historia-usuario.md). La descripción debe contener sólo información interna minimizada; se enlaza a contratos/versiones del repo en lugar de pegar contenido sensible.

Estado: `Intake`.

### 2. Refinar y decidir

El analista concreta la frase «Como…, quiero…, para…», alcance, exclusiones y criterios comprobables. QA define cómo se probará; UX revisa estados y accesibilidad si hay interfaz. Arquitectura participa si se cruzan módulos, APIs, tablas, eventos o infraestructura. Seguridad/privacidad entra siempre que haya identidad, RBAC, auditoría, exportación, logs, proveedor, datos o secretos.

Si faltan datos o una decisión de producto, no se estima ni empieza desarrollo: se abre una `Decisión/ADR` vinculada y se marca `Bloqueada`. El PO aprueba o rechaza la historia, y sus condiciones se registran en el campo `Decisión PO`.

Estados: `Refinamiento` → `Pendiente aprobación PO` → `Diseño/ADR`.

### 3. Diseñar y planificar

El responsable técnico define archivos/módulos propietarios, contratos, migraciones si aplican, estrategia de rollback de aplicación, pruebas y riesgos. El diseño transversal se registra en ADR. Se asignan roles y clase de modelo conforme a la [matriz de roles y modelos](matriz-roles-y-modelos.md), con contexto mínimo y sin secretos.

Antes de desarrollar se comprueba que no colisiona con otra rama/sesión. Si dos historias necesitan el mismo módulo, tabla, migración o ruta, se acuerda una fundación con propietario antes de empezar; no se resuelve copiando cambios entre árboles sucios.

Estado: `Lista para desarrollo`.

### 4. Desarrollar en rama aislada

1. Comprobar `git status --short`, rama, base y trabajo ajeno; no descartar ni mezclar cambios.
2. Partir de la base identificada y crear `codex/<sesion>-<tema>`; incluir el número de Issue cuando ayude a la trazabilidad.
3. Registrar en la Issue la rama, base/SHA, archivos previstos y responsable antes o al iniciar la edición.
4. Trabajar mediante commits pequeños, coherentes y reversibles; separar migración, implementación, pruebas y documentación cuando proceda.
5. Usar únicamente fixtures sintéticos. No añadir `.env`, tokens, dumps, artefactos locales ni información de cliente.
6. Ejecutar pruebas proporcionales, TypeScript/build cuando aplique y `git diff --check`; inspeccionar el diff antes de preparar el commit.
7. Publicar la rama según el workflow y enlazar SHA/PR en la historia.

Estado: `En desarrollo` → `En revisión`.

### 5. Revisar y validar

El revisor independiente parte de contrato, diff, pruebas y ADR, no de una conclusión del implementador. QA comprueba criterios positivos y negativos, aislamiento, regresión y evidencia sintética; ejecuta o revisa una E2E cuando el cambio atraviesa interfaz, API, persistencia, autorización, integración o un flujo crítico. Si E2E no aplica, deja la justificación y la validación alternativa. UX valida teclado, foco, mensajes, responsive y copy cuando corresponde. Seguridad/privacidad revisa minimización, autorización en servidor, secretos, logs, auditoría, retención/exportación e implicaciones de proveedor cuando aplica.

Los hallazgos se registran como comentarios o Issues vinculados, con severidad y evidencia. Sólo los resueltos o aceptados de forma explícita por PO pueden dejar pasar la puerta. Un riesgo alto no se «resuelve» cerrando el Issue: necesita control o aceptación documentada.

Estados: `QA/validación` → `Lista para merge`.

### 6. Merge, despliegue y validación de producto

Una persona autorizada integra únicamente una PR con checks/revisiones exigidas correctos y sin conflicto de dependencias. La persona con autoridad de entorno decide si se despliega; no se activa CD ni se usa producción por cambiar el estado de la tarjeta. Antes de datos reales se mantienen las obligaciones S15, DPO, asesoría laboral y Go/No-Go.

Tras un despliegue permitido, el PO y QA validan el resultado contra los criterios de aceptación. La historia enlaza PR, commits, resultado de pruebas, entorno de evidencia y decisión. Se cierra con un aprendizaje breve: qué conservar, qué corregir y qué nueva decisión/historia abre.

Estados: `Merged` → `Pendiente despliegue autorizado` → `Desplegada` → `Validación producto` → `Cerrada`.

## Uso de modelos y agentes

- **Luna:** clasificación, checklist, borrador de documentación no crítica. Nunca aprueba cambios.
- **Terra/Sol:** desarrollo acotado, pruebas y revisión normal.
- **Astra/Sol de esfuerzo alto:** arquitectura transversal, seguridad, RGPD, migración, auditoría, exportación e infraestructura.
- Tras dos intentos equivalentes se detiene la repetición: se divide, se mejora la evidencia o se escala de rol/modelo.
- En alto riesgo se exige revisión cruzada por un modelo/rol distinto y aprobación humana; el modelo no recibe más contexto del estrictamente necesario.

## Definición práctica de bloqueo

Una historia se marca `Bloqueada` si falta una decisión PO, ADR, dependencia técnica integrada, evidencia sintética, revisión obligatoria, responsable de entorno o aprobación externa. El comentario de bloqueo contiene: causa, quién puede desbloquear, decisión solicitada y siguiente fecha de revisión. No se inventa una solución para que el tablero parezca avanzar.

## Checklist de cierre

- [ ] Criterios de aceptación y exclusiones verificados.
- [ ] PR, rama, SHA, pruebas y documentación enlazados.
- [ ] QA, UX, seguridad/privacidad y SRE revisaron cuando aplicaba.
- [ ] No hubo PII, secretos ni datos de cliente en la trazabilidad.
- [ ] PO aceptó el resultado y el riesgo residual, si lo hubiera.
- [ ] El aprendizaje y cualquier seguimiento quedaron en un Issue nuevo y trazable.
- [ ] El estado refleja la realidad: no `Cerrada` si falta despliegue/validación o hay un bloqueo.

## Qué no haremos

No añadiremos agentes persistentes, bots con token, webhooks, Actions que cambien estados, sincronizaciones con otra herramienta, deployments automáticos ni conexiones de cliente como parte de este modo de trabajo. Cualquiera de esas capacidades requiere un contrato/ADR nuevo, revisión de privacidad y seguridad, prueba sintética, mínimo privilegio y aprobación explícita independiente.
