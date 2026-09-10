# S11 — Pruebas, QA y datos de demostración

**Objetivo:** sostener calidad y demostración segura durante todo el delivery. **Tamaño:** M. **Ejecución:** continua desde S0.

## Alcance

Fixtures sintéticos, pruebas de contrato, unitarias, integración, E2E, matrices de casos de jornada y smoke tests. Propietaria de datos demo; no debe introducir datos personales reales.

## Entregable y aceptación

Entorno demo reproducible con empresas ficticias; pruebas críticas de tenant, fichaje, corrección, cálculo, exportación y fechas; criterios de regresión integrados en CI.

## Dependencias y validación

Consume contratos de S0 y evoluciona con todas las sesiones. Riesgo: fixtures que oculten fallos reales o datos reales en demo. Validación de anonimato/sinteticidad y ejecución automática en CI.

## Registro de implementación S11 — 10/09/2026

Estado: **base de QA y datos demo implementada para S1–S4/S10; validación local de pruebas, smoke, tipado y build correcta.**

### Superficie entregada

- `tests/support/demo-fixtures.ts`: perfiles y UUIDs deterministas, identidades sintéticas `@demo.test`, jornadas estándar, partida y nocturna, y casos UTC de medianoche/DST.
- `scripts/seed-demo.ts`: seeder idempotente por perfil (`office` o `multisite`) para una base dedicada vacía; exige contraseña local de demo, no imprime secretos y rechaza mezclar dos empresas en un mismo entorno.
- `tests/qa-demo.test.ts` y `tests/qa-contracts.test.ts`: sinteticidad, calendario temporal, autorización de auditoría, aislamiento de consulta y preservación append-only.
- `scripts/smoke.ts`, `npm run qa:smoke` y `.github/workflows/qa.yml`: smoke sin servicios externos, pruebas críticas, `npm test`, tipado y build Node 20.19 en CI.
- [Matriz QA](../qa-matrix.md) y [datos demo](../demo-data.md): trazabilidad, comandos y dependencias.

### Resultado de validación S11

- Correcto con Node 24 del runtime local: `vitest run` — 31 pruebas en 10 suites; `npx tsc --noEmit` — correcto; `npm run qa:smoke` ejecutado con el mismo runtime — 23 pruebas en 6 suites y tipado correctos.
- Correcto: `next build` con `DATABASE_URL` y `ENVIRONMENT_ID` ficticios de build — compilación y 23 rutas generadas. Sin esas variables el build local se rechaza por validación de configuración, comportamiento esperado; el Dockerfile ya las inyecta sólo para build.
- Pendiente de repetir en Docker/PostgreSQL: E2E HTTP y concurrencia reales. No se cargaron datos demo en la base existente ni se modificó código de dominio.
- Incidencia abierta: [QA-001](../qa-incidents.md), permisos ausentes de autoconsulta/autofichaje para el rol `employee`; se documenta sin eludir mínimo privilegio.
- Entrega Git: commit local `fe94d13` creado en `codex/s11-qa-demo`. La publicación queda bloqueada porque el token OAuth actual no dispone del permiso `workflow` para crear `.github/workflows/qa.yml`; no se ha alterado ni descartado el cambio.

### Límites y bloqueos

Los E2E HTTP/PostgreSQL de S1–S4 pueden ejecutarse con Docker y una base migrada; S11 no añade navegador porque no existe aún una base Playwright/E2E. Permanecen pendientes S5 cálculo, S6 correcciones, S7 interfaz empleado, S8 administración, S9 exportaciones y S12 despliegue/backup/proxy. La lectura con lector QR físico y el rate-limit de infraestructura siguen siendo pruebas previas a piloto.

No se modifican rutas, módulos ni migraciones productivas de S1–S4. No se introducen GPS, biometría, cámara, foto, vídeo ni vigilancia.
