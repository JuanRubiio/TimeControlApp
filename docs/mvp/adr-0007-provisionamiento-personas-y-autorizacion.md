# ADR-0007 — Provisionamiento de personas, autoridad y activación de cuentas

**Estado:** propuesto para revisión PO, seguridad/privacidad y UX. **Issue:** [#66](https://github.com/JuanRubiio/TimeControlApp/issues/66). **Dependencias:** ADR-0002, ADR-0003, S1, S2, S10 y S15. No autoriza implementación ni datos reales.

## Contexto

S2 permite una ficha mínima de empleado y una relación laboral, pero no define un flujo seguro de provisión de identidad, delegación de altas, activación de cuenta o revocación. Tratar un correo como identidad suficiente, permitir que Responsable asigne roles sensibles o mezclar ficha laboral y credenciales abriría riesgos de suplantación, PII excesiva y escalada de privilegios.

## Decisión propuesta

Se separan cuatro conceptos: **persona laboral**, **relación laboral**, **cuenta de acceso** y **asignación de rol/ámbito**. Ninguna pantalla ni API los deduce entre sí por el correo, el nombre o un parámetro del navegador.

### Matriz de autoridad

| Actor | Puede | No puede |
| --- | --- | --- |
| Administración | Crear, modificar y desactivar fichas de empleado; crear responsables; asignar/revocar rol `manager`; asignar centros y vigencias; resolver una alta asistida. | Crear o modificar administradores desde este flujo, usar cuentas compartidas o saltarse auditoría/MFA. |
| Responsable | Crear o proponer fichas de **empleado** únicamente en un centro vigente de su ámbito; actualizar datos mínimos de esas fichas mientras conserve ámbito. | Crear responsable, administrador o auditor; otorgar roles; crear/editar centros; reasignar fuera de ámbito; autoasignarse o gestionar su propia autoridad. |
| Empleado | Consultar su propia ficha mínima y usar las capacidades ya autorizadas. | Crear, promover, reasignar o activar a otras personas. |
| Sistema | Ejecutar sólo un proceso de activación/revocación previamente aprobado y auditado. | Decidir identidad, rol, centro o relación laboral. |

Administración puede crear un empleado como vía excepcional de continuidad, pero el Responsable no recibe `role.assign`, `employment.write` global ni `site.write`. El servidor comprueba actor, permiso, entorno dedicado, centro y vigencia en toda mutación; la UI es sólo una representación.

### Datos mínimos

Una alta de empleado contiene sólo:

- nombre visible de trabajo;
- identificador interno de empresa **opcional**, único si la organización decide usarlo;
- centro ya existente y relación laboral con fecha de inicio/vigencia;
- responsable opcional y válido en ese centro, cuando corresponda;
- correo **corporativo** únicamente si se aprueba como canal de activación.

Quedan excluidos DNI/NIE/pasaporte, domicilio, teléfono personal, fecha de nacimiento, fotografía, biometría, nómina, salud, contacto de emergencia, localización y datos de terceros. El correo corporativo no sustituye el identificador interno ni acredita por sí mismo identidad laboral.

### Activación, revocación y credenciales

1. Crear ficha y relación no crea sesión, contraseña ni acceso efectivo.
2. El canal de activación será una decisión técnica posterior. Si se aprueba correo corporativo, será una invitación de un solo uso, caducable, revocable, sin contraseña en URL/log/auditoría y con reintento limitado. No se habilitan correo personal, SMS, mensajería, notificaciones, SSO ni envío automático por este ADR.
3. Hasta aprobar ese canal, la alternativa es alta asistida por Administración con credencial inicial entregada fuera de la aplicación mediante un procedimiento aprobado; este ADR no diseña ni ejecuta la entrega.
4. Desactivar la ficha, terminar relación o revocar la cuenta bloquea nuevas sesiones y conserva la evidencia/auditoría aplicable; no borra de forma destructiva registros previos.
5. Las cuentas `admin` siguen MFA obligatorio según ADR-0002. Convertir una persona en Responsable exige asignación explícita de Administración, centro/vigencia y auditoría; no deriva de tener empleados a cargo.

## Reglas verificables para futuras historias

- Un Responsable que manipule `siteId`, `role`, `managerId` o `employmentId` fuera de su ámbito recibe denegación sin revelar recursos ajenos.
- Sólo Administración puede conceder, modificar o revocar `manager`; ninguna ruta de alta de empleado acepta `admin`, `manager` o `auditor` desde cliente.
- Un duplicado de correo corporativo o identificador interno se comunica sin revelar datos de otra persona; la operación es idempotente y auditable.
- Toda asignación conserva actor, motivo, centro, vigencia y correlación; no se reescribe la evidencia laboral ni las decisiones históricas.
- Alta, activación, fallo, expiración, revocación y baja se prueban con fixtures `@demo.test`, sin secretos, correo real, tokens, contenido laboral ni PII en logs.
- Formularios futuros cubren carga, validación, duplicado, ámbito denegado, centro inactivo, relación inválida, activación pendiente, revocación, vacío, móvil, teclado y lector de pantalla con los componentes de S25.

## Consecuencias y secuencia

- #67 puede diseñar el formulario de empleado condicionado a esta matriz, pero no implementar el canal de activación sin contrato propio.
- #68 puede diseñar el formulario de responsable y asignación de ámbito, exclusivamente para Administración.
- Cualquier migración, permiso nuevo, endpoint, plantilla de invitación, proveedor de correo o UI requiere historias separadas, revisión UX, seguridad/privacidad, QA y pruebas E2E sintéticas.
- S15 conserva el NO-GO para datos reales; este ADR no aprueba DPA, proveedor, entrega de credenciales ni uso de personas reales.

## Alternativas descartadas

- **Responsable crea responsables:** permite escalada jerárquica y rompe segregación de funciones.
- **Correo como identificador único suficiente:** no cubre errores de dirección, cambios de correo ni identidad laboral; amplía dependencia de un canal.
- **Alta pública/autoregistro:** no valida centro, relación, ámbito ni autorización laboral.
- **Contraseña creada por Responsable:** expone secretos, dificulta revocación y mezcla autoridad laboral con credenciales.
- **Un único formulario para empleado, responsable y administración:** oculta diferencias de riesgo y favorece asignaciones accidentales.

## Criterios de salida de #66

- PO confirma la matriz de autoridad y el mínimo de datos.
- Seguridad/privacidad valida minimización, auditoría, activación, revocación y tratamiento del correo corporativo.
- UX revisa el límite entre alta de ficha, relación y activación, sin formularios coercitivos ni datos avanzados en el flujo principal.
- QA define pruebas de autorización negativa e idempotencia antes de abrir #67 o #68 a desarrollo.
