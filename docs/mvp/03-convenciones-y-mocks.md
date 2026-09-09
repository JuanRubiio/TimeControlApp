# S0 — Convenciones, interfaces temporales y trabajo paralelo

## Módulos y dependencias

El monolito se organiza por dominio: `auth`, `users`, `roles`, `permissions`, `audit`, `companies`, `sites`, `employees`, `employment`, `work-rules`, `time-events`, `corrections`, `approvals`, `exports`. Cada módulo expone sólo contratos públicos (tipos, comandos, consultas y eventos); ningún módulo accede directamente a tablas/repositorios internos de otro. La dirección permitida es interfaz de dominio → adaptador de infraestructura, nunca UI → base de datos.

S0 no crea código. S1 decide la ubicación física exacta compatible con Next.js y publica un índice de contratos compartidos. Las sesiones documentan cualquier dependencia nueva antes de importarla.

## Migraciones

- Una migración por cambio lógico, reversible cuando sea posible y segura al reintento; prefijo `sNNN_YYYYMMDDHHMM_descripcion`.
- La sesión propietaria crea y prueba su migración; otra sesión no cambia sus tablas sin acuerdo registrado.
- Toda migración declara efecto, datos históricos, compatibilidad de versión, paso de rollback y auditoría si transforma evidencia.
- Nunca se edita una migración aplicada. Se añade una nueva migración correctiva.
- El despliegue ejecuta migración antes de activar la versión compatible; rollback de aplicación no debe requerir borrar datos.

## Pruebas

Unitarias para invariantes; integración para PostgreSQL, autorización, auditoría y migraciones; contrato para interfaces/eventos; E2E para flujos críticos. Todo caso de acceso incluye permitido, denegado y entorno/ámbito incorrecto. Fijar reloj y zona en pruebas; incluir DST y medianoche en módulos temporales. Datos demo sólo sintéticos.

## Despliegue

Una imagen/versionado inmutable se promueve por entorno dedicado. Configuración y secretos quedan fuera de la imagen y repositorio. S12 automatiza provisión, migración, backup, restauración y rollback; logs estructurados usan `correlationId` y minimizan PII. Ningún cambio de contrato asume infraestructura compartida entre clientes.

## Puertos temporales para S1–S4

| Puerto | Proveedor final | Mock de desarrollo | Consumidores |
|---|---|---|---|
| `CurrentActorProvider.get()` | S1 auth | actor fijo tipado, con rol/ámbito explícito | S2–S4 |
| `Authorizer.assert(input)` | S1 permissions | allow/deny determinista y auditable en prueba | S2–S4 |
| `AuditWriter.append(entry)` | S1 audit | colector append-only en memoria | S2–S4 |
| `RuleResolver.resolve(input)` | S3 work-rules | versión fija con zona IANA y vigencia | S4 |
| `Clock.now()` | S1/shared | reloj congelable UTC | S2–S4 |
| `DomainEventPublisher.publish(event)` | S1/shared | outbox en memoria que registra eventos | S2–S4 |

Los mocks deben implementar exactamente la interfaz publicada, no duplicar lógica de producto. Las pruebas de contrato verifican el mismo conjunto de casos contra mock y adaptador real antes de integrar.
