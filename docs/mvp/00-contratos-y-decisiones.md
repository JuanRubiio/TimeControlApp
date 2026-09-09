# S0 — Contratos y decisiones

**Objetivo:** documentar contratos técnicos y validar decisiones aprobadas antes de implementar. **Tamaño:** M. **Ejecución:** documentación base completada; pendiente revisión de consumidores S1–S4 y S12.

## Entregables verificables

- ADR de entorno dedicado por cliente, monolito modular TypeScript/Next.js, PostgreSQL, Docker, autenticación, fechas/zona horaria y auditoría.
- Diagrama de dominio y esquema inicial: empresa, centro, empleado, contrato, regla, evento, corrección, aprobación, auditoría y exportación.
- OpenAPI/versionado de errores, permisos y eventos; mocks de interfaces.
- Decisiones de `README.md` registradas como aprobadas y traducidas a contratos implementables.

## Alcance y aislamiento

Sólo `docs/mvp`, contratos compartidos y tipos/mocks futuros. No implementar producto ni migraciones funcionales. Propietaria de convenciones transversales.

La decisión de plataforma y aislamiento está fijada en [ADR-0001](adr-0001-plataforma-y-aislamiento.md). S0 la completa, sin cambiarla, con [ADR-0002](adr-0002-autenticacion.md), [ADR-0003](adr-0003-roles-y-permisos.md), [ADR-0004](adr-0004-fechas-y-zona-horaria.md) y [ADR-0005](adr-0005-auditoria-inmutable.md).

## Paquete documental S0

- [Modelo de dominio inicial](01-modelo-de-dominio.md): entidades, límites e invariantes para S1–S9.
- [Contratos de integración](02-contratos-integracion.md): HTTP, eventos, errores y autorización.
- [Convenciones y mocks](03-convenciones-y-mocks.md): módulos, migraciones, pruebas, despliegue y puertos temporales para S1–S4.
- [Aceptación y riesgos S0](04-aceptacion-y-riesgos-s0.md): puertas verificables y decisiones pendientes.

## Dependencias, riesgos y aceptación

Sin dependencias. Decisiones aprobadas: ICP de pymes/medianas generalistas, web responsive/PWA, QR/PIN, sin geolocalización/biometría, pausas manuales visibles, aprobación de incidencias/correcciones, CSV inicial, español, piloto asistido con prueba de 14 días, entorno dedicado automatizado por cliente, monolito modular, TypeScript/Next.js, PostgreSQL y Docker. Riesgo restante: documentar insuficientemente automatización, backups y despliegues de entornos dedicados. Aceptación: ADRs y contratos revisados por quienes implementarán S1–S4 y S12.
