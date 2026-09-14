# Contrato operativo — GitHub Issues y Projects

**Estado:** operativo para sesiones locales autorizadas. **Ámbito:** `JuanRubiio/TimeControlApp` y el Project privado autorizado; aplicar junto al [flujo Git](git-workflow.md) y la [guía de conexión segura](../delivery/guia-conexion-codex-github-projects-issues.md).

## Propósito y límites

Usar GitHub Issues y Projects como trazabilidad de producto y delivery, no como fuente de código ni como motor de automatización. Git sigue siendo la fuente de verdad de código y los contratos Markdown la fuente de decisiones.

- El PO aprueba prioridad, alcance, riesgo, transición a desarrollo y cierre de producto.
- `gh` se usa de forma puntual y por encargo explícito; nunca como bot persistente ni mediante webhooks, Actions, Apps, OAuth, tokens en `.env` o scripts programados.
- Un Issue no contiene PII, datos laborales reales, exportaciones, backups, contraseñas, códigos de dispositivo, tokens, cookies, logs crudos ni secretos.
- El estado `Merged`, `Desplegada` o `Cerrada` nunca se actualiza automáticamente. S15/NO-GO sigue prevaleciendo sobre cualquier tarjeta o etiqueta.

## Preflight obligatorio

1. Confirmar el repositorio, número del Project, objetivo de la sesión y cambios autorizados.
2. Ejecutar `gh auth status`; no imprimir ni copiar el token. Si la credencial no es válida, el titular se autentica interactivamente con MFA.
3. Verificar el alcance mínimo: `repo` para Issues privadas y `project`/`read:project` para Projects. Solicitar sólo el alcance que exige la operación concreta.
4. Inspeccionar antes de escribir: Issues existentes por título/estado, Project, campos, opciones y elementos ya añadidos.
5. Para mutaciones, preparar una lista explícita de Issue, cuerpo, etiquetas, campos y estado objetivo; solicitar confirmación cuando no venga inequívocamente en el encargo.

No reautenticar, ampliar permisos, crear Projects/campos, modificar accesos, activar automatizaciones o cerrar/borrar trabajo existente sin una orden específica.

## Escritura de Issues

Cada Issue candidata comienza en `Intake` o `Refinamiento` y describe como mínimo:

- objetivo, usuario/rol y beneficio observable;
- alcance y exclusiones explícitas;
- criterios preliminares verificables;
- evidencia o hipótesis, riesgos y mitigaciones;
- dependencias, contrato/ADR propietario y decisión pendiente del PO.

## Puerta UX/UI antes de desarrollar interfaz

Toda Issue que cree o cambie una pantalla, flujo, formulario, navegación o componente visible debe pasar una revisión UX/UI **antes** de implementar. No basta con que el contrato funcional sea correcto.

1. Identificar el rol, tarea principal, estados de carga/vacío/error/éxito, móvil y teclado.
2. Revisar la propuesta contra el catálogo de componentes y los patrones visuales existentes; si falta un patrón, definirlo primero como componente reutilizable.
3. Sustituir identificadores y entradas técnicas por etiquetas humanas y ayudas progresivas. Los datos avanzados permanecen disponibles, pero no dirigen el flujo principal.
4. Para información espacial, mostrar una representación visual comprensible y declarar qué se muestra, qué no se registra y qué datos no se envían. Un mapa no autoriza seguimiento, proveedor ni telemetría.
5. Adjuntar al Issue el resultado de la revisión UX/UI y sus criterios de aceptación; QA realiza una comprobación visual y E2E sintética antes de `En revisión`.

Si una historia ya implementada revela una fricción visual sustancial, se abre una Issue UX separada y se bloquea su paso a revisión de producto hasta acordar si el ajuste pertenece al alcance actual. La revisión UX/UI no modifica RBAC, privacidad, contratos de servidor ni aprobación PO; los complementa.

Para crear o actualizar Issues se prefiere la API REST de `gh` cuando la operación sea de repositorio. Antes de repetir una creación fallida, buscar por título y URL: una sesión parcialmente interrumpida puede haber creado el Issue aunque no haya podido añadirlo al Project. No repetir un lote completo a ciegas.

Las etiquetas sirven para lectura visual, no sustituyen campos del Project. Mantener un vocabulario reducido, con color y significado estable; por ejemplo fase, decisión PO, riesgo de geolocalización o aplazamiento. Una capacidad desplazada de una exclusión a discovery debe actualizar el Issue/ADR de exclusión para no dejar contradicciones.

## Escritura de Projects

1. Consultar `gh project view` y `gh project field-list`; usar los IDs y opciones devueltos, nunca valores inventados.
2. Añadir únicamente Issues autorizadas. No añadir PRs al Project salvo encargo separado.
3. Completar los campos configurados: `Tipo`, `Prioridad`, `Tamaño`, `Riesgo`, `Dominio propietario`, `Decisión PO`, `Revisión QA`, `Seguridad / privacidad`, `UX / accesibilidad`, `SRE / operación`, `Modelo / clase` y `Dependencia`.
4. Confirmar que la tarjeta queda en `Intake` o `Refinamiento` salvo transición aprobada por PO.
5. Informar URLs, cambios efectuados y cualquier elemento que no haya podido incorporarse.

Projects usa GraphQL. Puede añadirse un Issue al Project y actualizar campos mediante mutaciones GraphQL, pero una mutación de campos no debe suponer que el Issue fue creado o vinculado: comprobarlo separadamente al terminar.

## Cuotas, lotes y recuperación

GitHub mantiene cuotas distintas para REST y GraphQL, además de límites secundarios y de complejidad. La experiencia operativa confirma que una ráfaga de ediciones de campos puede recibir `RATE_LIMIT`, `RESOURCE_LIMITS_EXCEEDED` o `API rate limit exceeded` aunque la API REST de Issues continúe disponible.

- Preferir lecturas concentradas y mutaciones acotadas; evitar un `gh project item-edit` por campo dentro de un bucle grande.
- Agrupar sólo un número moderado de cambios GraphQL y dividir por Issue o pequeños grupos. No asumir un umbral fijo: la complejidad depende de la consulta y puede variar.
- Ante una limitación, detener el lote, conservar números/URLs/IDs de lo ya creado, informar el estado y esperar al restablecimiento. No reintentar en bucle ni repetir cambios confirmados.
- Mientras GraphQL esté limitado, se pueden crear, corregir y etiquetar Issues mediante REST si están autorizadas, pero se declara explícitamente que su incorporación/campos de Project queda pendiente.
- Tras recuperarse la cuota, añadir sólo los elementos pendientes y completar únicamente los campos ausentes; verificar que no se han creado duplicados.

## Idempotencia y corrección de errores

Si una operación falla a mitad:

1. Inventariar primero: Issues por título, estado y URL; elementos del Project; etiquetas y campos aplicados.
2. Reanudar desde el primer elemento no confirmado; no recrear los ya existentes.
3. Si aparece un duplicado producido por la propia sesión, no ocultarlo: confirmar el número exacto, no añadirlo al Project y cerrar/marcarlo como no planificado sólo con autorización dentro del objetivo de corrección.
4. Registrar en la respuesta final qué quedó aplicado, qué se aplazó por cuota y cuál es el siguiente paso seguro.

## Relación con Git, rama y cierre

Un Issue aprobado abre una sesión de implementación separada que sigue [git-workflow.md](git-workflow.md). Antes de editar, se crea una rama por Issue con el patrón `codex/issue-<numero>-<tema>`, desde una base identificada. En el mismo momento se añade al Issue un comentario conciso con la rama, la base y el contrato/ADR aplicable. Así la asociación existe durante el desarrollo, no sólo al abrir la PR.

Antes de crear una PR, su título y cuerpo se preparan en un fichero Markdown temporal y se inspeccionan localmente. Se publica mediante `gh pr create --body-file`; después se lee de vuelta con `gh pr view --json body` para verificar encabezados, saltos de línea, enlaces y el cierre. No se usan cadenas con `\\n` como sustituto de un cuerpo multilínea.

La PR debe contener `Closes #<numero>` para enlazarla nativamente al Issue y cerrarlo sólo al integrarse. Si una rama atiende excepcionalmente más de un Issue, el PO debe autorizarlo y el cuerpo enumera cada relación; la norma por defecto sigue siendo una rama y una PR por Issue. La tarjeta enlaza evidencia y recomienda estado; no ejecuta merge, despliegue ni cierre por sí sola.

## Checklist de salida

- [ ] La credencial y los permisos usados fueron mínimos y no se expusieron.
- [ ] No se creó ni modificó automatización, acceso, secreto, webhook, App o entorno.
- [ ] Cada Issue contiene sólo información minimizada y enlaces a contratos.
- [ ] Las etiquetas y campos reflejan estado real, sin enviar trabajo a desarrollo sin DoR/PO.
- [ ] Se verificaron duplicados, elementos pendientes y ausencia de PRs no autorizadas.
- [ ] La rama se registró en el Issue al iniciarse y la PR usa cuerpo Markdown verificado, con `Closes #<numero>` cuando corresponda.
- [ ] La respuesta identifica cambios, límites de API y decisiones pendientes.
