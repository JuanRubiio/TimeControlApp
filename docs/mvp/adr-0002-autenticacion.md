# ADR-0002 — Autenticación y sesiones

**Estado:** Aprobado para el MVP el 09/09/2026.  
**Decisores:** propietario del producto; contrato S0.

## Contexto

El sistema contiene registros laborales y acciones administrativas sensibles. El entorno ya es dedicado por cliente (ADR-0001), pero eso no sustituye la identificación individual ni el control de sesión. El MVP no incluye SSO ni proveedor corporativo externo.

## Decisión

1. Cada persona usuaria tiene una identidad individual; quedan prohibidas las cuentas compartidas para empleado, responsable o administración.
2. El inicio de sesión del MVP será mediante credenciales locales con contraseña robusta y almacenamiento mediante hash resistente a ataques. Nunca se guarda ni audita una contraseña, PIN o secreto en claro.
3. Las cuentas con rol administrativo deben completar MFA. El mecanismo concreto se elegirá en S1 tras un ADR complementario si afecta al proveedor, pero ha de ser resistente a phishing cuando sea viable y permitir recuperación auditada.
4. Las sesiones se crean y validan exclusivamente en servidor, con expiración, revocación y rotación de credenciales de sesión. La interfaz no interpreta por sí misma que una sesión o permiso sea válido.
5. QR y PIN de kiosco son métodos de fichaje, no sustitutos de una sesión administrativa ni de una identidad con privilegios. Su emisión, uso, bloqueo y rotación se auditan.
6. Los intentos fallidos, recuperación de acceso, alta/baja de MFA, inicio/cierre/revocación de sesión y cambios de credenciales generan auditoría minimizada, sin secretos.

## Consecuencias

- S1 implementa `auth` y `users`, incluidos MFA, sesiones y revocación.
- S4 podrá consumir un contexto de fichaje limitado para QR/PIN; no obtendrá permisos de administración.
- SSO, login social, passkeys como único método o cuentas de asesoría requieren decisión posterior; no se presuponen.

## Reglas verificables

- No se concede acceso por el mero identificador enviado por el cliente.
- Un usuario desactivado o una relación laboral inactiva no puede iniciar una nueva sesión de empleado.
- Toda mutación autenticada debe poder vincularse a un `actorId` o a un actor técnico explícito, nunca a una identidad implícita.
- Las pruebas incluyen revocación, usuario desactivado, MFA obligatorio para administración y no filtración de secretos en respuesta, log o auditoría.
