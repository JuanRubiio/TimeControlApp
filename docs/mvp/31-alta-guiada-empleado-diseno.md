# S30 — Diseño de alta guiada de empleado en centro autorizado

**Issue:** [#67](https://github.com/JuanRubiio/TimeControlApp/issues/67). **Estado:** diseño para revisión UX, privacidad y QA. **Dependencias:** ADR-0007, ADR-0003, S2 y S25. Este documento no autoriza implementación, activación de cuentas ni uso de datos reales.

## Objetivo y límite

Un Responsable puede crear una **ficha laboral mínima de empleado** y su primera relación laboral sólo en un centro activo que continúe dentro de su ámbito efectivo. El resultado no es una cuenta: no genera sesión, contraseña, invitación ni ningún acceso.

La experiencia se ofrece en `Equipo` como acción secundaria `Añadir empleado`, no en la configuración global. Administración conserva su flujo administrativo independiente y puede resolver una continuidad excepcional conforme al ADR-0007.

## Flujo de interfaz

1. Al abrir el flujo, el servidor resuelve los centros activos y vigentes del Responsable. Si sólo existe uno, aparece preseleccionado y visible; si hay varios, se elige mediante `ui-control`.
2. El formulario presenta el propósito y el límite: «Crea una ficha y una relación laboral. No crea acceso a la aplicación». Incluye nombre visible, identificador interno opcional, centro y fecha de inicio.
3. La persona revisa un resumen compacto de esos valores y confirma `Crear ficha laboral`. La acción usa `ui-action`, queda inhabilitada durante el envío y conserva el foco y los datos introducidos tras un error recuperable.
4. El éxito confirma el empleado y la relación creados, con estado informativo `Acceso sin activar`. Ofrece volver a `Equipo` o crear otra ficha; nunca una invitación, una contraseña ni un cambio de rol.

No se usa un asistente largo: el resumen antes de confirmar evita altas accidentales sin añadir pasos sin valor. En escritorio el formulario mantiene ancho legible; en móvil las acciones se apilan y conservan la misma jerarquía visual de S25.

## Campos y reglas de validación

| Campo | Regla | Tratamiento UX |
| --- | --- | --- |
| Nombre visible de trabajo | Obligatorio, recortado, de 1 a 160 caracteres. | Error local junto al campo; no se aceptan valores sólo de espacios. |
| Identificador interno | Opcional; si se informa, único por empresa. | El conflicto se comunica de forma genérica, sin mostrar datos de otra persona. |
| Centro | Obligatorio, activo y perteneciente al ámbito vigente del actor. | Sólo se listan centros autorizados; una manipulación de identificador se rechaza en servidor sin revelar recursos. |
| Inicio de relación | Obligatorio, fecha ISO válida y compatible con la vigencia del centro y del Responsable. | Ayuda contextual y error específico de fecha, sin inferir relaciones ajenas. |

El Responsable directo no es un selector del navegador. La primera versión puede dejarlo sin asignar o asociarlo al empleado que representa al actor únicamente si esa relación es vigente en el centro y la política de producto lo confirma. Nunca se acepta `managerEmployeeId`, `role`, `userId`, `employmentId` ni campos de ámbito desde el cliente.

Quedan fuera del formulario correo, documento identificativo, domicilio, teléfono, nacimiento, foto, biometría, nómina, salud, contacto de emergencia, localización y datos de terceros. El correo corporativo es un eventual canal de activación posterior, no un dato necesario en este flujo.

## Estados y mensajes

- **Carga:** bloque compacto `LoadingBlock` mientras se resuelve el ámbito, sin vaciar toda la vista de Equipo.
- **Sin centro elegible:** estado vacío que explica que Administración debe asignar un centro vigente; no muestra controles deshabilitados ni permite envío.
- **Edición y validación:** `ui-field` y `ui-control`; errores con texto asociado y foco en el primer campo inválido.
- **Enviando:** botón compacto ocupado e idempotente; no duplicar la acción con clics o reintentos.
- **Éxito creado o repetido:** misma representación segura; indica ficha laboral creada y acceso sin activar.
- **Fallo recuperable:** red, sesión caducada, referencia/fecha inválida, centro inactivo o duplicado devuelven aviso útil. La autorización o un centro fuera de ámbito no confirma su existencia.

El lector de pantalla recibe cambio de estado mediante región viva; teclado conserva orden lógico y foco. Las ayudas no dependen sólo de color ni de iconos.

## Contrato de servidor y modelo propuesto

Las rutas administrativas actuales para crear empleado y relación no son adecuadas para este caso: son dos mutaciones separadas y exigen permisos globales. Una implementación posterior debe exponer un único comando atómico de ámbito, por ejemplo `POST /api/v1/manager/employees`, con:

```json
{
  "displayName": "Nombre de demostración",
  "internalEmployeeIdentifier": "opcional",
  "siteId": "centro-autorizado",
  "effectiveFrom": "2026-09-15"
}
```

El comando requiere una clave de idempotencia, crea ficha y relación en una transacción, valida empresa/centro/actor/fecha, aplica la unicidad del identificador interno y registra una correlación única de auditoría. La respuesta puede derivar `activationStatus: "not_started"` sólo para presentar que no hay acceso; no crea un sistema de activación.

Será necesario añadir un permiso compuesto y acotado, por ejemplo `employee.provision:site`; no se concede a `manager` `employee.write`, `employment.write`, `role.assign`, `site.write` ni permisos de autenticación globales. El servidor verifica permiso, entorno, pertenencia vigente del actor y estado del centro dentro de la misma transacción. La operación registra actor, motivo de alta, centro, vigencia y correlación con datos mínimos; no incluye secretos ni PII adicional en logs.

## Autorización negativa y exclusiones

Empleado, auditor, persona no autenticada y Responsable sin centro vigente no ven ni ejecutan la operación. Un Responsable no puede crear responsables, administradores o auditores; otorgar roles, editar una relación existente, reasignar centros, importar en masa, baja, activación, invitación, correo, SSO, SMS o contraseña se tratan en historias y contratos separados.

S15 conserva el NO-GO: sólo fixtures sintéticos `@demo.test` y ninguna entrega de credenciales o dato real.

## Criterios de E2E para la futura implementación

1. Un Responsable con un centro autorizado crea una ficha válida y sólo la observa dentro de su Equipo, con `Acceso sin activar`.
2. Con varios centros sólo puede seleccionar los autorizados; sin centros aparece el vacío seguro.
3. Alterar identificadores de centro, responsable, rol, usuario o relación produce denegación no reveladora y cero escrituras.
4. Centro inactivo, fecha inválida, ámbito vencido y duplicado interno fallan de forma controlada y revierten toda la transacción.
5. Repetir una petición con la misma clave produce la misma respuesta sin segundo empleado ni segunda relación; la auditoría conserva la correlación.
6. Se prueban carga, red, sesión, móvil, teclado, lector de pantalla y trazas con fixtures sintéticos, además del control de permisos en servidor.
