# ADR-0001 — Plataforma y aislamiento por cliente

**Estado:** Aprobado por propietario del producto el 09/09/2026.

## Contexto

El MVP procesa datos laborales y debe priorizar privacidad, trazabilidad y recuperación. El producto inicial se ofrece a pymes y medianas generalistas españolas. No hay stack previo en el repositorio que deba conservarse.

## Decisiones

1. Cada cliente se ejecutará en un entorno dedicado. La aplicación, PostgreSQL, almacenamiento de exportaciones, secretos y backups no se compartirán con otros clientes.
2. Los entornos dedicados se desplegarán con Docker y aprovisionamiento automatizado. No se aceptarán pasos manuales recurrentes para alta, actualización, migración, copia de seguridad, restauración o rollback.
3. El producto será un monolito modular, sin microservicios en el MVP.
4. El stack será TypeScript con Next.js, PostgreSQL y una interfaz web responsive preparada para PWA. No habrá app nativa.
5. PostgreSQL será el sistema de registro transaccional y de auditoría. Las migraciones deberán ser versionadas, idempotentes y ejecutables por todos los entornos de cliente.

## Consecuencias

Positivas: radio de impacto reducido, narrativa clara de aislamiento, backups/restauración por cliente y menor riesgo de acceso cruzado. Negativas: coste e ingeniería de plataforma superiores, exigencia de observabilidad centralizada minimizada y necesidad de automatización antes del piloto.

## Reglas de implementación

- No usar tablas multitenant compartidas como mecanismo principal de aislamiento.
- No registrar datos personales innecesarios en observabilidad central.
- Toda actualización debe incluir estrategia de migración y rollback compatible con múltiples entornos.
- Cualquier cambio a microservicios, multitenancy compartido, otro SGBD, app nativa, GPS o biometría requiere ADR nuevo y aprobación del propietario.
