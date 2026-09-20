# 03 — Plantillas operativas

## Intake

`Problema | usuario/rol | beneficio | evidencia/hipótesis | urgencia | riesgo/dependencia | exclusiones conocidas`.

## Historia

`Como [rol], quiero [acción], para [beneficio]`, más alcance, exclusiones, criterios verificables, riesgos, dependencias, ADRs, plan de pruebas, roles, trazabilidad y Definition of Done.

Crear la historia como Issue y completar: `estado inicial = Intake`, prioridad, tamaño, riesgo, dominio propietario y decisión PO. Enlazar documentos en lugar de duplicar contenido sensible.

## Decisión PO

`Issue | decisión (aprobar / devolver / aplazar / rechazar) | alcance aceptado | exclusiones | prioridad | riesgo residual aceptado | motivo/evidencia | responsable | fecha de revisión`.

La aprobación para desarrollar se registra en la Issue y se refleja en el Project al moverla a `Lista para desarrollo`. Una aprobación anterior no autoriza cambios materiales de alcance, riesgo o dependencia: se solicita una decisión nueva.

## Inicio de desarrollo

`Issue | rama codex/issue-<número>-<tema> | rama base y SHA | implementador | archivos/áreas previstas | contrato/ADR | plan de pruebas | inicio`.

Publicar este registro como comentario breve en la Issue antes o al iniciar la edición. Si la Issue no está `Lista para desarrollo`, no se crea una rama de entrega.

## Pull request

`Closes #<número>`; resumen; alcance y exclusiones; decisiones/ADRs; riesgo y rollback; pruebas ejecutadas; evidencia de QA/E2E; cambios de datos/configuración; checklist de documentación.

El título y cuerpo de la PR se preparan como Markdown legible y se revisan antes de publicar. Tras crearla, verificar que enlaza la Issue correcta, que los checks se ven y que el Project conserva la trazabilidad; la creación de una PR mueve la Issue a `En revisión`, no a `Merged`.

## Validación funcional y E2E

`Issue/PR | entorno sintético | precondiciones | recorrido de usuario | datos de prueba | resultado esperado | resultado real | evidencia/enlace | responsable | fecha | incidencias`.

La E2E es obligatoria cuando el cambio atraviesa interfaz, API, persistencia, autorización, integración o un flujo crítico. Si no aplica, QA deja una justificación explícita y la alternativa de validación. Un fallo abre o enlaza una Issue, devuelve la tarjeta a `En desarrollo` y bloquea el merge hasta que la evidencia se actualice.

## Autorización de merge

`PR | Issue | checks requeridos | revisión técnica | QA/E2E | seguridad/privacidad si aplica | decisión PO si aplica | responsable integrador | decisión y fecha`.

La autorización es una comprobación final, no una formalidad: confirma que la rama base, la Issue, las decisiones y la evidencia siguen vigentes. El merge no cierra automáticamente la aceptación de producto ni autoriza un despliegue.

## Encargo de sesión

`HU/fase | rol/versión | objetivo | archivos/documentos autorizados | salida | modelo/esfuerzo | prohibiciones | dos reintentos | escalado | receptor`.

## Decision / riesgo residual

`ID | contexto/evidencia | opciones | decisión y límites | impacto | controles | responsable humano | revisión/caducidad`.

## Definition of Ready

No desarrollar sin historia, criterios, exclusiones, riesgos, dependencias, prueba, responsables y PO. Si falta algo, bloquear.

## Definition of Done

No cerrar sin criterios verificados, Issue/PR/commits enlazados, pruebas, revisiones, documentación, evidencia de entorno y validación de producto proporcional. Para historias con flujo integrado, incluir E2E pasada o una excepción explícita aprobada. Cerrar en el Project sólo tras la evidencia de aceptación o despliegue que defina el proyecto.
