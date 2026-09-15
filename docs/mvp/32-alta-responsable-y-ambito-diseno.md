# S31 — Diseño de alta de responsable y asignación de ámbito

**Issue:** [#68](https://github.com/JuanRubiio/TimeControlApp/issues/68). **Estado:** diseño para revisión UX, privacidad y QA. **Dependencias:** ADR-0002, ADR-0003, ADR-0007, S2 y S25. No autoriza una cuenta, activación, invitación ni uso de datos reales.

## Objetivo y límite

Administración asigna el rol `manager` y su ámbito a una persona ya elegible. No es una alta de credenciales: el candidato debe disponer de una ficha de empleado, una cuenta ya vinculada y activa, y una relación laboral vigente en el centro a gestionar. Si falta cualquiera de estos elementos, la UI no simula una asignación pendiente ni crea una cuenta; orienta al flujo futuro correspondiente.

El flujo vive exclusivamente en `Administración > Personas y ámbitos > Responsables`. Un Responsable, Empleado, Auditor o persona no autenticada no ve ni ejecuta la operación. Administración tampoco puede usarlo para crear/modificar administradores o auditores, ni para modificar su propio rol o ámbito.

## Flujo de interfaz

1. Administración busca y selecciona una persona elegible mediante combobox accesible. La lista muestra nombre laboral e identificador interno si existe; nunca correo, credenciales u otros datos personales.
2. Se muestra y selecciona la relación laboral vigente del candidato en un centro activo. En el MVP sólo se habilita **un centro simultáneo**: el ámbito se deriva de esa relación, no se elige mediante multiselección.
3. Se informa fecha de inicio, fin opcional y motivo operativo mediante selector cerrado: `alta organizativa`, `cobertura` o `cambio organizativo`. Las fechas deben pertenecer a la vigencia de la relación.
4. Una revisión compacta confirma candidato, centro, vigencia y motivo. `Asignar responsable` es una `ui-action` compacta y se bloquea mientras se procesa.
5. El éxito indica que el acceso de Responsable queda limitado al centro y vigencia elegidos. No ofrece enviar correo, crear contraseña ni cambiar privilegios adicionales.

Al cambiar o retirar un ámbito, una futura interfaz crea una transición fechada: cierra la asignación vigente y registra otra, o fija su fin con motivo. Nunca reescribe la evidencia histórica. La ampliación a varios centros simultáneos queda fuera: S2 no permite relaciones laborales solapadas del empleado y exige relación vigente en el mismo centro; requerirá extensión de modelo y ADR propios.

## Elegibilidad, campos y validaciones

| Elemento | Regla de servidor | Comportamiento UX |
| --- | --- | --- |
| Candidato | Ficha de empleado activa, cuenta vinculada y activa en la misma empresa. | Si no es elegible, se explica el requisito sin exponer cuentas ni personas ajenas. |
| Relación laboral | Vigente en un centro activo de la empresa. | El centro y su identidad de ámbito se derivan de la relación seleccionada. |
| Vigencia | Inicio obligatorio ISO; fin opcional, posterior al inicio y dentro de la relación laboral. | Campo fecha con ayuda, validación en línea y resumen antes de confirmar. |
| Motivo | Obligatorio y perteneciente al catálogo cerrado. | `ui-control` compacto, no texto libre ni notas con PII. |

El navegador no envía ni controla `userId`, `role`, `siteId`, `scopeType` o `scopeId`. La asignación se deduce exclusivamente de empleado y relación validados por el servidor. Un solape se comunica como conflicto seguro, sin revelar asignaciones de otras personas.

## Estados, accesibilidad y componentes

- **Carga / vacío:** `LoadingBlock` compacto al resolver elegibilidad y estado vacío si no hay candidatos; no recarga toda la página administrativa.
- **Edición:** `ui-field`, `ui-control`, combobox con teclado y lector de pantalla, selector de motivo, fechas y resumen en tarjeta `admin-section`.
- **No elegible:** cuenta no vinculada/inactiva, relación vencida o centro inactivo explican el requisito y no habilitan confirmar.
- **Envío y resultado:** acción compacta con estado ocupado; éxito, reintento de red, sesión vencida, fecha inválida, conflicto, 403/404 no revelador y foco sobre el mensaje correspondiente.
- **Responsivo:** las fechas y acciones se apilan en móvil; el orden de foco y los textos no dependen sólo de color, iconos o posición.

El diseño reutiliza los componentes del catálogo S25; no introduce selectores nativos sin estilo, botones de ancho completo ni una pantalla de carga que sustituya el contenido ya disponible.

## Contrato de servidor y persistencia propuestos

La implementación posterior debe usar un comando administrativo, atómico e idempotente, por ejemplo `POST /api/v1/manager-assignments`:

```json
{
  "employeeId": "empleado-elegible",
  "employmentId": "relacion-vigente",
  "validFrom": "2026-09-15",
  "validTo": null,
  "reasonCode": "organizational_onboarding"
}
```

El servidor deriva la cuenta, `role: manager`, `scopeType: site` y el centro a partir de la relación; comprueba tenant, permiso administrativo, cuenta, empleo, centro, fechas y solapes en una misma transacción. Cada mutación exige `Idempotency-Key`; los cambios o revocaciones son transiciones fechadas, no actualizaciones destructivas. Los errores diferenciables incluyen cuenta inactiva, relación inválida y solape, pero se representan sin enumerar recursos fuera de autorización.

Hace falta un permiso de Administración explícito (por ejemplo `manager-assignment.write`, o la restricción equivalente de `role.assign`) y actualizar ADR-0003/catálogo de permisos al implementarlo. Ese permiso nunca se concede a `manager`. La persistencia necesitará garantizar no solapes de `manager` para mismo usuario, centro y vigencia, conservar transición y registrar auditoría/outbox con actor, candidato, relación, centro derivado, fechas, motivo-código y correlación. Sin email, secretos, notas libres ni PII adicional en logs. Tras cambio o revocación se resuelve de nuevo el ámbito efectivo e invalida sesiones/capacidades conforme a ADR-0002.

## Exclusiones y privacidad

No incluye alta pública, password, correo, SMS, SSO, invitación, activación de cuenta, cambio de administrador/auditor, autoservicio, multisitio, centros nuevos, importación masiva, borrado de evidencia ni datos reales. S15 conserva su NO-GO; las pruebas usan exclusivamente fixtures `@demo.test`.

## Criterios E2E para la futura implementación

1. Administración asigna un candidato con cuenta y relación activas; el resultado sólo permite navegación de Responsable en el centro asignado.
2. Responsable, Empleado, Auditor y no autenticado no acceden a ruta ni comando; la manipulación de usuario, rol o ámbito no produce escritura ni revela recursos.
3. Cuenta sin vincular/inactiva, relación o centro no vigentes, fechas inválidas y solape se muestran de forma controlada.
4. Repetir con la misma clave de idempotencia no duplica la asignación; el cambio y la revocación cierran el acceso al vencer y preservan auditoría.
5. Se validan vacío, carga sin parpadeo global, red, sesión, móvil, teclado, lector de pantalla y ausencia de PII/secretos en DOM y trazas.
