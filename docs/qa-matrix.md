# Matriz QA — S11

Estado: 10/09/2026. Esta matriz sólo cubre código integrado hasta S4 y S10. Cada entorno de demostración corresponde a un único cliente/empresa, conforme al ADR-0001.

| Requisito MVP | Suite o comprobación | Estado |
|---|---|---|
| S1 sesión, MFA y RBAC en servidor | `tests/permissions.test.ts`, `tests/totp.test.ts`, `tests/qa-contracts.test.ts` | Automatizado unitario/contrato; HTTP+PostgreSQL requiere Docker |
| S1 auditoría append-only y entorno dedicado | `tests/audit-sql.test.ts`, `tests/qa-contracts.test.ts` | Automatizado contrato SQL |
| S2 empresa, centros, baja lógica y mínimos datos | `tests/company-people.test.ts`, `tests/company-people-sql.test.ts` | Automatizado unitario/contrato SQL |
| S2 relaciones, ámbitos y responsable | `tests/company-people.test.ts`, `tests/rule-scopes.test.ts` | Automatizado unitario/contrato |
| S3 vigencia, solapamientos, calendario y pausas | `tests/work-rules.test.ts` | Automatizado unitario/contrato SQL |
| S3 IANA, medianoche y DST | `tests/work-rules.test.ts`, `tests/qa-demo.test.ts` | Automatizado unitario |
| S4 entrada/salida/pausas y secuencias inválidas | `tests/time-events.test.ts` | Automatizado unitario/contrato SQL |
| S4 duplicados, idempotencia y concurrencia | `tests/time-events.test.ts`; E2E HTTP Docker documentado en S4 | Contrato automatizado; concurrencia HTTP pendiente de repetir en entorno Docker |
| S4 QR/PIN | `tests/time-events.test.ts` | Contrato de no secreto en claro; lector QR físico pendiente |
| S10 acceso a auditoría y minimización | `tests/qa-contracts.test.ts`, `tests/company-people-sql.test.ts` | Automatizado contrato |
| Smoke de entorno | `npm run qa:smoke` | Ejecutable sin servicios externos |
| CI | `.github/workflows/qa.yml` | Ejecuta tests, smoke y build en Node 20.19 |

## Pendientes por sesión

S5: cálculo de horas, excesos y evidencia derivada. S6: correcciones aditivas y aprobación. S7: E2E de interfaz de empleado y PWA. S8: E2E de administración. S9: exportaciones CSV/PDF, autorización y reproducibilidad. S12: despliegue dedicado, migración/rollback, backup/restauración, rate-limit de proxy y observabilidad. Antes de piloto sigue pendiente una lectura con dispositivo QR real.

## Incidencia abierta

La [QA-001](qa-incidents.md) impide demostrar el fichaje con una cuenta de rol `employee` con mínimo privilegio hasta que S1 entregue una migración aditiva de permisos.
