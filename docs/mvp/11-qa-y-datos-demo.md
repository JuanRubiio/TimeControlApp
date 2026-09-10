# S11 — Pruebas, QA y datos de demostración

**Objetivo:** sostener calidad y demostración segura durante todo el delivery. **Tamaño:** M. **Ejecución:** continua desde S0.

## Alcance

Fixtures sintéticos, pruebas de contrato, unitarias, integración, E2E, matrices de casos de jornada y smoke tests. Propietaria de datos demo; no debe introducir datos personales reales.

## Entregable y aceptación

Entorno demo reproducible con empresas ficticias; pruebas críticas de tenant, fichaje, corrección, cálculo, exportación y fechas; criterios de regresión integrados en CI.

## Dependencias y validación

Consume contratos de S0 y evoluciona con todas las sesiones. Riesgo: fixtures que oculten fallos reales o datos reales en demo. Validación de anonimato/sinteticidad y ejecución automática en CI.

## Registro de implementación S11 — 10/09/2026

Estado: **revisada tras integrar S1–S12; base de QA, CI y datos demo vigente para todos los dominios implementados.**

### Superficie entregada

- `tests/support/demo-fixtures.ts`: perfiles y UUIDs deterministas, identidades sintéticas `@demo.test`, jornadas estándar, partida y nocturna, y casos UTC de medianoche/DST.
- `scripts/seed-demo.ts`: seeder idempotente por perfil (`office` o `multisite`) para una base dedicada vacía; exige contraseña local de demo, no imprime secretos y rechaza mezclar dos empresas en un mismo entorno.
- `tests/qa-demo.test.ts` y `tests/qa-contracts.test.ts`: sinteticidad, calendario temporal, autorización de auditoría, aislamiento de consulta y preservación append-only.
- `scripts/smoke.ts`, `npm run qa:smoke` y `.github/workflows/qa.yml`: smoke sin servicios externos para todas las suites S1–S12, tipado y build Node 20.19 en CI.
- [Matriz QA](../qa-matrix.md) y [datos demo](../demo-data.md): trazabilidad, comandos y dependencias.

### Revisión de cierre S1–S12

- Correcto en esta revisión con Node 24 del runtime local: `vitest run` — **60 pruebas en 20 suites**; `npm run qa:smoke` ejecutado con el mismo runtime — **60/60** y `tsc --noEmit` correcto.
- S5–S9 añaden cálculo determinista, correcciones aditivas, interfaz empleado, administración y exportaciones CSV/PDF; S12 añade comprobaciones de observabilidad y operación. Sus suites se incorporan al smoke de S11, sin duplicar lógica de dominio.
- La CI ejecuta `npm test`, el smoke, tipado y build con `DATABASE_URL`/`ENVIRONMENT_ID` sintéticos; no usa secretos ni conecta con PostgreSQL durante build.
- La matriz actualizada enlaza cada dominio con sus pruebas, E2E ya documentados y bloqueos restantes. No se cargaron datos demo en una base existente durante esta revisión.
- Incidencia abierta: [QA-001](../qa-incidents.md), permisos ausentes de autoconsulta/autofichaje para el rol `employee`; se documenta sin eludir mínimo privilegio.
- La incidencia S10/S12 sobre retención de exportaciones, backup/restore, proxy y operación no se marca como resuelta: requiere pruebas operativas previas al piloto.

### Límites y bloqueos

Los E2E HTTP/PostgreSQL de S1–S9 pueden ejecutarse con Docker y una base demo migrada; S6 y S8 ya documentan ejecuciones sintéticas. S11 no añade navegador porque no existe una base Playwright/E2E. Siguen pendientes el E2E autenticado S7, el E2E de exportaciones por perfiles/vencimiento, QR físico, rate-limit/TLS/WAF y la validación operativa S12 de imágenes, backup/restore y eliminación de exportaciones.

No se modifican rutas, módulos ni migraciones productivas de S1–S4. No se introducen GPS, biometría, cámara, foto, vídeo ni vigilancia.
