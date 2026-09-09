# S0 — Modelo de dominio inicial

## Límites y relaciones

```text
Environment (entorno dedicado) 1—1 Company
Company 1—N Site
Company 1—N User; Employee 0—1 User
Employee 1—N Employment; Employment N—1 Site (vigente por rango)
WorkRule 1—N RuleVersion; RuleVersion aplica a Company/Site/colectivo y vigencia
Employee 1—N TimeEvent; TimeEvent N—1 Employment, Site, RuleVersion
TimeEvent 1—N Correction; Correction 0—1 Approval
AuditEntry N—1 recurso/actor (referencia lógica, no dependencia borrable)
Export 1—N ExportItem; Export referencia período, fuentes y manifiesto
```

## Entidades y responsabilidades

| Entidad | Propietaria | Campos/identidad mínimos | Invariantes |
|---|---|---|---|
| `Environment` | S1/S12 | `id`, cliente técnico, estado | representa un único cliente; no comparte DB/secretos/backups |
| `Company`, `Site` | S2 | identificador, nombre, estado; `Site.timeZone` IANA | bajas lógicas; un centro pertenece a una empresa |
| `User`, `RoleAssignment` | S1 | identidad, estado, roles/ámbito/vigencia | una identidad es individual; roles auditables |
| `Employee`, `Employment` | S2 | empleado, relación, centro, responsable, vigencia | relación no solapada cuando la política lo prohíba; histórico preservado |
| `WorkRule`, `RuleVersion`, `Calendar`, `Shift` | S3 | alcance, vigencia, configuración/versionado | nunca se sobrescribe una versión aplicable |
| `TimeEvent` | S4 | tipo, `occurredAt`, `recordedAt`, método, idempotencia, regla efectiva | inmutable; secuencia válida; no GPS/biometría |
| `Correction`, `Approval` | S6 | referencia, propuesta, motivo, estado, actor/fechas | aditiva; decisión sólo por responsable autorizado |
| `AuditEntry` | S1 | campos ADR-0005 | append-only; no secretos |
| `Export`, `ExportItem` | S9 | filtro, fuentes, manifiesto, hash, estado | reproducible; acceso y generación auditados |

## Referencias y ciclo de vida

Se usan UUIDs opacos como IDs externos y claves internas según decida S1. Las referencias históricas no se borran: `Employee`, `Site`, `Employment`, reglas y usuarios admiten estado/fin de vigencia. Un evento conserva referencias resueltas al momento de registro (`employmentId`, `siteId`, `ruleVersionId`, zona) para no recalcular historia con la configuración actual.

La “incidencia” se modelará en S6 como tipo de `Correction` o entidad separada sólo tras decisión documentada; ambas alternativas deben mantener solicitud, motivo, estados y auditoría aditivos.
