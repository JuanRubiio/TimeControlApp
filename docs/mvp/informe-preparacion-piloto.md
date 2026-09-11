# Informe de preparación de piloto

**Recomendación:** **no listo (NO-GO)**. **Fecha:** 10/09/2026. **Versión evaluada:** `9f29232` más correcciones S13 no integradas; rama de informe `codex/s13-validacion-e2e-piloto`.

Actualización: Docker y Node ya son ejecutables en el entorno sintético. Build Docker, health, migración, seed office, 64/64 pruebas y E2E de empleado/RBAC/logout se han completado. Permanecen los bloqueos de operación y los recorridos E2E no ejecutados.

Actualización 11/09/2026: se ejecutaron dos entornos dedicados office/multisite y se rechazó una cookie office en multicentro (401). Se verificaron empleado nocturno, MFA administrativa TOTP, decisión de correcciones y generación/descarga autorizada de CSV/PDF. Los casos temporales siguen cubiertos por las suites deterministas. Quedan pendientes sólo controles de infraestructura/operación y revisión humana de UX, accesibilidad, legal y privacidad.

## Entorno y evidencia

- Windows local, PowerShell; Node `v18.12.1`, npm `8.19.2`.
- Docker Client 28.0.1, contexto `desktop-linux`; daemon inaccesible (`//./pipe/dockerDesktopLinuxEngine` no existe).
- Datos previstos: fixtures S11 `office` y `multisite`, identidades `@demo.test`; **ningún dato fue cargado**.
- Comandos ejecutados: `git fetch TimeControlApp`; `docker version`; `docker compose --env-file .env config --quiet`; `docker compose --env-file .env ps`; `npm test`; `npx tsc --noEmit`; `npm run qa:smoke`; `npm run build`.
- Resultado: Compose no puede conectar al daemon. Vitest/smoke fallan al cargar por Node 18 (`statfsSync`); build se rechaza porque Next requiere >=20.9. No hay capturas, porque la app no arrancó.

## Escenarios

Los críticos de arranque, login/MFA/logout, RBAC HTTP, aislamiento de dos entornos, administración, empleado, medianoche/DST, correcciones, auditoría y CSV/PDF quedaron **bloqueados** de ejecución. La revisión estática encontró APIs y pantallas para fichaje, historial, correcciones, lectura administrativa, auditoría y exportación, así como foco visible y responsive CSS; no es sustituto de E2E.

## Defectos y mejoras

| Prioridad | Defecto / riesgo | Estado |
|---|---|---|
| P0 | Ninguno confirmado por ejecución. | No concluyente. |
| P1 | S13-001: rol employee sin permisos de fichaje/autoconsulta. | Abierto, S14. |
| P1 | S13-002: entorno no ejecutable (Docker/Node). | Abierto, S14. |
| P1 | S13-003: no hay UI de login/MFA/logout. | Abierto, S14. |
| P1 | S13-004: dataset E2E completo no materializado/ejecutado. | Abierto, S14. |
| P1 | S13-005: TLS/WAF/rate limit, restore, retención/borrado de exportaciones sin prueba. | Abierto, S14 + S10/S12. |
| P2 | S13-006: configuración inicial y exportación no tienen flujo UI. | Decisión producto S14. |
| P2 | S13-007: UUID técnicos visibles en detalle. | Mejora UX S14. |

No se corrigieron defectos en S13: todos los P1 requieren cambio material de permisos, UX de acceso, entorno o controles operativos y no se implementan implícitamente. No hay regresión asociada nueva; se debe añadir en S14.

## Riesgos y checklist Go/No-Go

- [ ] Docker limpio + Node 20.19+, migraciones, health, seed office/multisite.
- [ ] E2E positivo/negativo por rol y dos entornos aislados.
- [ ] Fichajes, pausas, jornada partida/nocturna, DST, duplicidad y recuperación.
- [ ] Corrección aditiva, recálculo, auditoría, CSV/PDF, hash, autorización y expiración.
- [ ] Restore aislado y prueba cruzada negativa; TLS/proxy/rate limit/WAF.
- [ ] DPO, abogado laboralista, DPA, retención/derechos/incidentes aprobados.
- [x] Sin datos reales, credenciales reales ni servicios de pago usados en S13.

La condición de Go es cerrar todos los P1 y ejecutar el checklist con evidencia. Véase [S13](13-validacion-e2e-y-preparacion-piloto.md) y [S14](14-cierre-bloqueos-piloto.md).
