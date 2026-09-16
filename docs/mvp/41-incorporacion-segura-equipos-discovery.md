# E-TC-35 — Incorporación segura de equipos para piloto

**Estado:** diseño de épica. No habilita correo, proveedor, credenciales reales, cuentas compartidas ni datos reales. S15 mantiene el NO-GO.

## Decisión de producto

La demostración de incorporación se entrega por etapas y separa siempre cuatro entidades: ficha laboral, relación laboral, cuenta de acceso y asignación de rol/ámbito. El éxito de una etapa no crea ni deduce la siguiente. Esta regla convierte el alta en una capacidad demostrable sin confundir un dato de contacto con identidad ni elevar privilegios por conveniencia.

El recorrido de demo debe poder explicar tres situaciones reales de operación: una persona ya forma parte del equipo pero aún no tiene acceso, una persona puede activar acceso de forma controlada y una persona activa puede ser nombrada responsable de un único centro mediante una decisión administrativa.

## Recorrido objetivo

1. **Ficha y relación.** Administración o Responsable autorizado crea una ficha mínima y una relación vigente en un único centro, en una única transacción. El resultado muestra `Acceso sin activar`.
2. **Activación sintética.** Sólo Administración inicia o revoca el desafío de activación de una ficha elegible. Para demo, el desafío llega a un adaptador sintético controlado; no hay proveedor ni correo externo.
3. **Primer acceso.** La persona consume el desafío una sola vez, define su contraseña y obtiene únicamente los roles y ámbitos ya otorgados. La activación no crea rol ni centro.
4. **Responsable opcional.** Administración asigna `manager` sólo a una cuenta activa con relación vigente, derivando un único centro. El cambio es fechado y auditable.
5. **Baja/revocación.** Desactivar cuenta, terminar relación o revocar desafío impide el acceso futuro y conserva evidencia mínima; no borra historia de fichajes ni relaciones.

## Entregas de valor y orden

| Tramo | Valor de demo | Precondiciones | Salida verificable |
| --- | --- | --- | --- |
| Alta laboral atómica | Un responsable autorizado incorpora una persona de su centro sin acceso implícito. | ADR-0007, permiso compuesto, RBAC y QA. | Ficha + relación o cero escrituras; `Acceso sin activar`. |
| Activación sintética | Administración demuestra el ciclo de invitación sin usar un servicio externo. | Contrato de desafío, hash de token, outbox/adaptador de prueba y seguridad. | Un solo consumo, revocación/expiración/reenvío seguros, sin secretos en trazas. |
| Ámbito de responsable | Administración delega un centro concreto a una persona ya activa. | Rol/ámbito fechado, MFA de administración y auditoría. | El responsable sólo puede abrir y operar su centro. |
| Revocación coherente | El piloto puede retirar acceso o detener una activación sin borrar evidencia. | Política de sesión, relación y activación. | Sesiones/desafíos futuros bloqueados y auditoría mínima. |

Cada tramo es una historia de implementación independiente. No se inicia el siguiente por el mero hecho de que el anterior esté fusionado.

## Requisitos no negociables

- Idempotencia y transacción para cualquier combinación de ficha, relación, desafío, cuenta o asignación.
- Permisos específicos y negativos: Responsable no crea responsables, Administración no usa el flujo para administradores, y la persona invitada no cambia su rol o ámbito.
- Respuestas no reveladoras ante recurso ajeno, cuenta existente, token inválido, relación vencida o centro fuera de ámbito.
- Auditoría con actor, operación, motivo-código, identificadores internos y correlación; nunca contraseña, token, correo completo, contenido de mensaje ni PII adicional.
- Fixtures exclusivamente `@demo.test`, sin salida de red hacia proveedor de entrega, y E2E que cubra reintento, expiración, revocación, repetición y permisos negativos.

## Puertas antes de implementación

1. PO aprueba el orden y la definición de «equipo listo para demo».
2. Seguridad/DPO y asesoría laboral validan el contrato de datos, copia, retención y revocación; cualquier envío externo abre una decisión adicional de proveedor/DPA/región.
3. Arquitectura aprueba agregados, permisos, migraciones aditivas, outbox sintética y plan de reversión.
4. QA aprueba matriz E2E sintética, incluyendo MFA administrativo y ausencia de secretos/PII en UI, APIs, logs y auditoría.

## Exclusiones

No cubre registro público, importación masiva, SSO, SMS, correo personal, proveedor externo, recuperación de contraseña, passkeys, múltiples centros simultáneos para responsable, administración de administradores/auditores, analítica de incorporación ni datos reales.

## Referencias

Este documento orquesta, sin sustituir, [ADR-0007](adr-0007-provisionamiento-personas-y-autorizacion.md), [alta guiada de empleado](31-alta-guiada-empleado-diseno.md), [asignación de responsable](32-alta-responsable-y-ambito-diseno.md) y [activación segura](33-activacion-segura-cuenta-diseno.md).
