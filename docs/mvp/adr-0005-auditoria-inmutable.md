# ADR-0005 — Auditoría inmutable y evidencia

**Estado:** Aprobado para el MVP el 09/09/2026.

## Decisión

La auditoría es un registro append-only separado de las entidades de negocio. Una corrección, decisión, acceso administrativo, cambio de configuración, exportación, operación de autenticación relevante o tarea técnica sensible añade una entrada; nunca modifica ni elimina la evidencia anterior.

Cada entrada contiene como mínimo: `id`, `occurredAt` UTC, `environmentId`, actor (`actorType`, `actorId` o identificador técnico), `action`, tipo e identificador de recurso, resultado (`success`/`denied`/`failure`), correlación, origen minimizado, y un resumen estructurado de cambios sin secretos. Para entidades temporales incorpora, cuando aplique, fecha laboral, zona efectiva y versión de regla.

## Integridad y acceso

1. La aplicación ordinaria no ejecuta `UPDATE` ni `DELETE` sobre entradas de auditoría; los permisos de base de datos lo impiden. La retención aplica preservación y exportación, no borrado normal.
2. Las correcciones son entidades aditivas que referencian el evento original. La aprobación es otra entidad/acción auditable; no altera el evento original.
3. La auditoría usa IDs inmutables, orden estable por `occurredAt,id` y encadenamiento de integridad o huella verificable por lote/exportación. S1 concreta el mecanismo técnico sin debilitar esta propiedad.
4. La lectura se limita por permiso y ámbito; exportar evidencia se audita antes de entregar el resultado.
5. No incluye credenciales, tokens, PIN, QR completo, contenido innecesario de PII ni datos de observabilidad ajenos.

## Consecuencias

S1 provee la infraestructura y el puerto `AuditWriter`; S2–S9 emiten acciones tipadas. S9 construye manifiestos y hashes reproducibles a partir de los datos fuente y auditoría, sin reescribirlos.
