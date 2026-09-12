# Matriz QA — S11

Estado: revisión post-S19 del 12/09/2026 contra `master` (`926d1fd`). Cada entorno de demostración representa un único cliente/empresa, conforme al ADR-0001.

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
| S13 validación integrada y piloto sintético | E2E Docker/HTTP `office` y `multisite`, regresiones `admin-ui`, RBAC de empleado | Ejecutado con datos sintéticos; controles externos permanecen NO-GO |
| S14 UX, accesibilidad y mínimo privilegio de empleado | `employee-rbac`, `ui-feedback`, `admin-ui` | Automatizado; QA-001 cerrada; aceptación humana final pendiente |
| S15 cierre operativo y cumplimiento | Contrato Go/No-Go y evidencias S10/S12/S13 | No es cobertura de código; bloqueante antes de datos reales |
| S16 configuración/exportación guiadas | Contrato de producto y regresión existente S2/S3/S9 | Pendiente de decisión/entrega guiada; no se declara implementada por S11 |
| S17 priorización de producto | Contrato y decisión de producto | Documental; no añade cobertura ejecutable |
| S18 estado informativo de jornada | `workday-status`, `workday-status-http` | Automatizado unitario/HTTP; recorrido visual humano pendiente |
| S19 acceso protegido e historial consistente | `auth-navigation`, `time-calculation-outbox`, regresiones de empleado | Automatizado; E2E Docker documentado para navegación y outbox |
| Datos demo sintéticos | `qa-demo`, `tests/support/demo-fixtures.ts`, `seed:demo` | Reproducibles e idempotentes; no se cargan sobre datos no demo |
| Smoke y CI | `npm run qa:smoke`, `.github/workflows/qa.yml` | Smoke S1–S19 y CI Node 20.19 |

## Riesgos y validaciones pendientes antes de piloto

- Probar lector QR físico y rate-limit/TLS/WAF del proxy.
- Ejecutar backup/restore aislado con validación de `ENVIRONMENT_ID`, retención/borrado de exportaciones y la aceptación humana de accesibilidad.
- Completar las puertas DPO, laboralista, DPA, retención, derechos e incidentes enumeradas por S10.
