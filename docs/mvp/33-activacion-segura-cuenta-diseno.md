# S32 — Diseño de activación segura de cuenta con invitación corporativa

**Issue:** [#72](https://github.com/JuanRubiio/TimeControlApp/issues/72). **Estado:** discovery para revisión PO, UX, seguridad/privacidad, QA y operación. **Dependencias:** ADR-0002, ADR-0003, ADR-0007, S1, S2, S10 y S15. No autoriza proveedor, entrega de correo, datos reales ni implementación.

## Propósito y separación de responsabilidades

La activación conecta una ficha laboral ya autorizada con una cuenta de acceso individual. No crea una ficha, relación laboral, rol, centro ni ámbito; tampoco demuestra identidad laboral por el correo. Es la última fase después de #67 o de una alta asistida de Administración. La promoción a Responsable de #68 sigue siendo una asignación administrativa separada.

Sólo Administración puede iniciar, reenviar con límite o revocar una activación. Responsable, Empleado, Auditor y una persona no autenticada no pueden enumerar ni operar activaciones. La persona receptora establece su propia contraseña; Administración nunca la conoce ni la transporta.

## Precondiciones y datos mínimos

Antes de habilitar la acción, el servidor comprueba en la misma empresa y entorno dedicado:

1. ficha de empleado activa y relación laboral vigente;
2. correo **corporativo** aprobado como canal de activación por la política que corresponda;
3. ausencia de una cuenta activa incompatible o de una invitación vigente no revocada;
4. actor con permiso administrativo específico y MFA válido;
5. estado de privacidad, retención, DPA y proveedor aún aprobados para la fase en que se vaya a entregar correo.

La pantalla administrativa sólo presenta nombre laboral, identificador interno si existe, estado de activación y la dirección corporativa enmascarada. No muestra contraseñas, tokens, credenciales, correo de terceros ni información laboral adicional.

## Experiencia de Administración

En `Administración > Personas y ámbitos`, cada ficha elegible muestra un estado compacto:

| Estado | Acción disponible | Resultado esperado |
| --- | --- | --- |
| Sin canal aprobado | Ninguna; explica el requisito. | No crea cuenta ni invitación. |
| Pendiente de activación | `Enviar invitación`. | Confirma dirección enmascarada, caducidad y no modifica roles. |
| Invitación vigente | `Revocar` y, bajo límite, `Reenviar`. | El reenvío invalida atómicamente la anterior. |
| Entrega fallida | `Reintentar` tras causa técnica segura. | No revela detalles del proveedor ni token. |
| Caducada o revocada | `Enviar invitación`. | Crea una nueva invitación, no reutiliza la anterior. |
| Cuenta activa | Sin acción de activación; acceso a consulta de auditoría autorizada. | No emite una segunda invitación. |

La confirmación usa un resumen de persona, estado y correo enmascarado, con `ui-action` compacta y acción de riesgo `ui-action--danger` para revocar. La vista conserva datos y foco ante fallo, no recarga el shell y tiene carga, vacío, error, éxito, teclado, lector de pantalla y móvil según S25.

## Experiencia de la persona invitada

El mensaje corporativo contiene sólo una URL HTTPS de un solo uso, caducable y no reutilizable. La página pública de activación no lista usuarios ni revela información laboral. Tras validar el desafío, solicita una contraseña robusta con confirmación y crea una sesión inicial sólo después de consumir la invitación de forma atómica.

La respuesta exterior es deliberadamente genérica para token ausente, inválido, consumido, caducado o revocado: invita a solicitar una nueva activación a Administración. No hay contraseña en URL, respuesta, analítica, auditoría, log, cabeceras ni cola. El token completo nunca se conserva: se genera con entropía criptográfica y se persiste únicamente su hash con propósito, expiración, consumo, revocación y correlación.

Una cuenta que reciba rol `admin` posteriormente sigue el enrolamiento MFA de ADR-0002 antes de acceder a capacidades administrativas. La activación por sí sola no provoca MFA ni añade ningún rol.

## Contrato de servidor propuesto

Una implementación posterior separa tres comandos atómicos, todos con `Idempotency-Key` y autorización de Administración:

```text
POST /api/v1/admin/account-activations
POST /api/v1/admin/account-activations/{activationId}/resend
POST /api/v1/admin/account-activations/{activationId}/revoke
POST /api/v1/account-activation/consume
```

El primer comando acepta sólo un identificador de empleado y motivo-código cerrado; el servidor resuelve cuenta, correo corporativo permitido, entorno y relación. El navegador no recibe ni elige `userId`, rol, centro, ámbito, token, proveedor o fecha de expiración. Reenviar revoca la invitación vigente y crea otra en la misma transacción lógica; revocar es fechada y conserva evidencia. Consumir acepta token y contraseña, bloquea por fila/desafío y crea o activa la cuenta sin cambiar autorizaciones.

La entrega se modela mediante una outbox transaccional y un adaptador de proveedor intercambiable. La API informa sólo estados de entrega permitidos; la cola incluye la referencia mínima y jamás un token o correo en trazas no protegidas. El proveedor, su región, DPA, supresión, reintentos, límite de frecuencia, plantillas y retención exigen ADR/contrato operativo antes de habilitar entrega fuera del entorno sintético.

Errores externos: `ACTIVATION_UNAVAILABLE`, `ACTIVATION_LINK_INVALID`, `ACTIVATION_NOT_ELIGIBLE` y `ACTIVATION_ALREADY_ACTIVE`, normalizados para no enumerar identidades. Los eventos/auditoría registran actor, empleado, estado, motivo-código, expiración, revocación, resultado técnico permitido y correlación; excluyen email, token, contraseña, contenido de plantilla y datos laborales.

## Límites de autorización y modelo

Se propone un permiso administrativo específico, por ejemplo `account-activation.manage`, sin otorgarlo a `manager`; requiere actualizar ADR-0003 antes de código. La migración futura añade un agregado de activación o desafío de propósito `account_activation`, una restricción de una invitación vigente por ficha/cuenta, hashes de token y la outbox. La revocación de cuenta o el fin de relación deben impedir nuevas sesiones y revocar activaciones pendientes; las sesiones existentes se invalidan conforme a ADR-0002 cuando sea necesario.

El mecanismo no reutiliza de forma implícita desafíos MFA: sus propósitos, cookies, duración, consumidores y auditoría permanecen separados. Los enlaces no se procesan en GET; la lectura sólo muestra una pantalla genérica y el consumo es un POST con protección contra repetición.

## Exclusiones y decisiones pendientes

No incluye correo personal, SMS, mensajería, SSO, registro abierto, cuentas compartidas, recuperación de contraseña, passkeys, gestión por Responsable, creación de roles, multientorno ni datos reales. Tampoco decide proveedor ni habilita envío automático.

Antes de abrir implementación, PO y DPO/seguridad deben confirmar el uso de correo corporativo, legitimación/información laboral, proveedor/DPA/región, contenido y retención de mensajes, plazo de expiración, límite de reenvíos, revocación, soporte y respuesta a rebotes. Operación debe aprobar la outbox, alertas, tratamiento de fallo y procedimientos de clave/proveedor.

## Criterios de E2E sintéticos de la futura implementación

1. Administración con MFA inicia activación para una ficha elegible; la invitación sintética se entrega por adaptador de prueba y no altera rol/ámbito.
2. Consumir una vez permite establecer contraseña e iniciar sesión; repetición, expiración, revocación y token modificado tienen respuesta genérica y no activan nada.
3. Reenviar limita frecuencia, invalida el desafío previo y no duplica cuenta ni outbox; fallos de entrega quedan auditados sin secreto.
4. Usuario fuera de ámbito, Responsable, Empleado, Auditor y no autenticado no pueden ejecutar ni enumerar la operación.
5. Baja de ficha, fin de relación o revocación bloquean activaciones y sesiones según contrato, preservando evidencia.
6. Navegador, API, base, cola y logs se prueban con `@demo.test`, sin correos reales, tokens, contraseñas, PII ni proveedor externo; se recorre teclado, lector de pantalla, móvil, carga y reintento.
