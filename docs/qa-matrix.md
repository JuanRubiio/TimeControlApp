# Matriz QA — S11

Estado: revisión de cierre 10/09/2026 contra `master` integrado S1–S12 (`9cf52a1`). Cada entorno de demostración representa un único cliente/empresa, conforme al ADR-0001.

| Requisito MVP | Suites o evidencia | Estado |
|---|---|---|
| S1 autenticación, sesión, MFA, RBAC y auditoría | `permissions`, `totp`, `audit-sql`, `qa-contracts` | Automatizado unitario/contrato |
| S2 empresa, centros, relaciones y baja lógica | `company-people`, `company-people-sql`, `rule-scopes` | Automatizado unitario/contrato SQL |
| S3 versiones, calendario, pausas e IANA/DST | `work-rules`, `qa-demo` | Automatizado unitario/contrato |
| S4 fichaje, pausas, secuencias, PIN/QR e idempotencia | `time-events`; E2E HTTP documentado en S4 | Automatizado; QR físico y rate-limit de proxy pendientes |
| S5 cálculo, incidencias, jornada partida/nocturna y DST | `time-calculation`, `time-calculation-sql` | Automatizado unitario/contrato SQL |
| S6 correcciones aditivas, decisión y recálculo | `corrections`, `corrections-sql`; E2E Docker S6 | Automatizado + integración HTTP documentada |
| S7 vista de empleado, acciones e historial | `employee-api`, `employee-presentation`; comprobación responsive S7 | Automatizado; E2E autenticado completo pendiente |
| S8 lectura administrativa, filtros y ámbitos | `admin`, `admin-sql`; E2E Docker S8 | Automatizado + integración HTTP documentada |
| S9 CSV/PDF, hash y autorización de exportaciones | `exports` | Automatizado unitario; HTTP por perfiles, vencimiento y borrado programado pendientes |
| S10 minimización, acceso a auditoría y privacidad | `qa-contracts`, `company-people-sql`, revisión S10 | Automatizado de contrato; controles operativos pendientes |
| S12 observabilidad, secretos y operación dedicada | `observability`, configuración/guías S12 | Automatizado estático; build fresco, backup/restore y proxy pendientes |
| Datos demo sintéticos | `qa-demo`, `tests/support/demo-fixtures.ts`, `seed:demo` | Reproducibles e idempotentes; no se cargan sobre datos no demo |
| Smoke y CI | `npm run qa:smoke`, `.github/workflows/qa.yml` | Smoke S1–S12 y CI Node 20.19 |

## Riesgos y validaciones pendientes antes de piloto

- [QA-001](qa-incidents.md): el rol `employee` aún no recibe permisos propios de fichaje; requiere migración aditiva de su propietario y E2E con mínimo privilegio.
- Repetir E2E HTTP integral S1–S9 sobre una base Docker limpia con perfiles demo, incluyendo exportación autorizada y descarga expirada.
- Probar lector QR físico y rate-limit/TLS/WAF del proxy.
- Ejecutar build fresco de imágenes S12, backup/restore aislado con validación de `ENVIRONMENT_ID`, y borrado programado de archivos de exportación.
- Completar las puertas DPO, laboralista, DPA, retención, derechos e incidentes enumeradas por S10.
