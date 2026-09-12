# S11 — Pruebas, QA y datos de demostración

**Objetivo:** sostener calidad y demostración segura durante todo el delivery. **Tamaño:** M. **Ejecución:** continua desde S0.

## Alcance

Fixtures sintéticos, pruebas de contrato, unitarias, integración, E2E, matrices de casos de jornada y smoke tests. Propietaria de datos demo; no debe introducir datos personales reales.

## Entregable y aceptación

Entorno demo reproducible con empresas ficticias; pruebas críticas de tenant, fichaje, corrección, cálculo, exportación y fechas; criterios de regresión integrados en CI.

## Dependencias y validación

Consume contratos de S0 y evoluciona con todas las sesiones. Riesgo: fixtures que oculten fallos reales o datos reales en demo. Validación de anonimato/sinteticidad y ejecución automática en CI.

## Registro de implementación S11 — 10/09/2026

Estado: **revisada tras integrar S1–S19; base de QA, CI y datos demo vigente para los dominios y contratos implementados.**

### Superficie entregada

- `tests/support/demo-fixtures.ts`: perfiles y UUIDs deterministas, identidades sintéticas `@demo.test`, jornadas estándar, partida y nocturna, y casos UTC de medianoche/DST.
- `scripts/seed-demo.ts`: seeder idempotente por perfil (`office` o `multisite`) para una base dedicada vacía; exige contraseña local de demo, no imprime secretos y rechaza mezclar dos empresas en un mismo entorno.
- `tests/qa-demo.test.ts` y `tests/qa-contracts.test.ts`: sinteticidad, calendario temporal, autorización de auditoría, aislamiento de consulta y preservación append-only.
- `scripts/smoke.ts`, `npm run qa:smoke` y `.github/workflows/qa.yml`: smoke sin servicios externos para todas las suites S1–S19, tipado y build Node 20.19 en CI.
- [Matriz QA](../qa-matrix.md) y [datos demo](../demo-data.md): trazabilidad, comandos y dependencias.

### Revisión post-S19

- Correcto en esta revisión con Node 24 del runtime local: `vitest run` y `npm run qa:smoke` — **98 pruebas en 29 suites**, con `tsc --noEmit` correcto.
- S13 validó de forma sintética Docker/HTTP los perfiles `office` y `multisite`, aislamiento, RBAC, fichaje, correcciones, exportaciones y MFA; sus regresiones quedan en la suite integrada.
- S14 cerró QA-001 con permisos propios mínimos para `employee`; S18 incorpora el estado informativo de jornada y S19 añade navegación protegida, retorno seguro y consumo idempotente de outbox para materializar cálculo.
- S15, S16 y S17 son puertas o decisiones de operación/producto: no se confunden con cobertura de código ni cierran por sí mismos el NO-GO de datos reales.
- La CI ejecuta `npm test`, el smoke, tipado y build con `DATABASE_URL`/`ENVIRONMENT_ID` sintéticos; no usa secretos ni conecta con PostgreSQL durante build.
- La matriz actualizada enlaza S1–S19 con sus pruebas, E2E ya documentados y bloqueos restantes. No se cargaron datos demo en una base existente durante esta revisión.
- [QA-001](../qa-incidents.md) queda cerrada con migración aditiva y prueba de mínimo privilegio.
- La incidencia S10/S12 sobre retención de exportaciones, backup/restore, proxy y operación no se marca como resuelta: requiere pruebas operativas previas al piloto.

### Límites y bloqueos

S13 ejecutó E2E HTTP/Docker sintético de los perfiles `office` y `multisite`; S19 validó navegación protegida y consumo/reintento de cálculo en Docker. S11 no añade navegador Playwright. Siguen pendientes QR físico, rate-limit/TLS/WAF, aceptación con lector de pantalla, backup/restore operativo aislado, retención/borrado de exportaciones y las aprobaciones de S15/DPO/laboral necesarias antes de datos reales.

Esta revisión S11 no modifica rutas, módulos ni migraciones productivas. No se introducen GPS, biometría, cámara, foto, vídeo ni vigilancia.
