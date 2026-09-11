# S13 — Validación E2E, experiencia de usuario y preparación de piloto

**Estado:** validación automatizada y recorrido visual completados; pendiente de controles externos y aprobaciones. **Base:** `9f29232` (`master`, 10/09/2026), más correcciones S13 en la rama `codex/s13-validacion-e2e-piloto`.

## Revalidación 10/09/2026

Docker Desktop activo permitió construir un entorno aislado `time-control-s13`, migrarlo y cargar datos sintéticos. Con Node 20 del contenedor y Node 24 empaquetado se verificaron 66/66 pruebas, compilación y health `{"status":"ok","database":"ok"}`. El E2E HTTP de un empleado obtuvo: login 200, autoconsulta 200, fichaje 201, repetición idempotente 200, exportación denegada 403, administración denegada 403 y sesión revocada 401.

Se corrigieron: permisos propios de empleado con migración aditiva; pantalla `/login` con MFA y logout; consulta propia que fallaba por columna SQL ambigua; inclusión del cifrado de backup en la imagen de pruebas; y serialización de migraciones concurrentes. Se revocaron exportaciones de ámbito al rol employee: el permiso existente permitía acceso a datos de terceros con ámbito de entorno.

Siguen bloqueando el Go únicamente los controles externos de operación, seguridad y cumplimiento indicados al final de este documento.

## Automatización ampliada 11/09/2026

- Dos proyectos Compose y dos PostgreSQL dedicados (`office` y `multisite`) arrancaron desde cero, migraron y superaron health checks. Una cookie de sesión válida de office recibió `401` en multicentro.
- El perfil multicentro se cargó con Madrid, Canarias y Levante; el empleado nocturno inició sesión (`200`), recibió cinco registros sintéticos y fue denegado en administración (`403`).
- El empleado office completó login (`200`), autoconsulta (`200`), fichaje (`201`), reintento idempotente (`200`), denegación de exportación/administración (`403`) y logout (`401` posterior).
- El responsable aprobó y rechazó solicitudes sintéticas y generó/descargó CSV y PDF autorizados. El contenido CSV se inspeccionó en la respuesta; la aserción binaria de BOM/cabecera PDF sigue cubierta por la suite S9 y queda pendiente convertirla en script HTTP versionado.
- MFA administrativa: contraseña, setup de secreto temporal y verificación TOTP finalizaron con `200`, sin registrar el secreto.
- `npm test` en Node 20 Docker: **66/66**. Las suites S3/S5 cubren fecha de jornada, medianoche y los dos cambios DST; no se ha usado un reloj del navegador ni datos reales.

Por tanto, los pendientes ya no son recorridos HTTP que puedan ejecutarse autónomamente con el entorno local actual: TLS/WAF/rate limit reales, backup/restore operativo en destino, retención/borrado programado, QR físico, revisión de lector de pantalla/UX visual y aprobaciones DPO, laboralista y operación.

## Recorrido visual integrado 11/09/2026

En el navegador integrado se recorrieron en vivo `/login`, `/employee`, historial de jornada nocturna, solicitud de corrección y `/admin`. El empleado creó una corrección sintética sobre la entrada del turno nocturno; el responsable, limitado a su centro, la vio, aprobó y comprobó el mensaje de recálculo. La vista final mostró la decisión aprobada y no presentó acciones repetibles. El dashboard del responsable mostró tres personas, un centro y las solicitudes pendientes autorizadas.

La ejecución encontró dos P1 acotados y se corrigieron: `listSites` seleccionaba una columna `id` ambigua al unir con `companies`, impidiendo cargar la administración; y el detalle de corrección no actualizaba su estado tras decidir. Sus regresiones están en `tests/company-people.test.ts` y `tests/admin-ui.test.ts`. Quedan como P2 la exposición de UUID técnico en el historial de decisión, la ausencia de UI de configuración/exportación y una revisión manual con lector de pantalla.

## Alcance y dependencias

S13 valida el MVP integrado S1–S12 como producto, con datos exclusivamente sintéticos de S11. Incluye arranque reproducible, seguridad/RBAC/aislamiento, flujos de administración, empleado, fichaje, cálculo, correcciones, exportación y revisión UX/accesibilidad. No crea funciones de negocio, integraciones, datos reales, GPS, cámara, biometría ni servicios de pago.

Depende de S1–S12, `docs/operations/local-development.md`, Docker Desktop y Node 20.19 o superior. Los archivos previstos son este contrato, la guía de piloto, el informe y la propuesta S14.

## Dataset demostrable requerido

La base S11 es sintética, determinista e idempotente: `office` contiene una empresa y un centro; `multisite`, una empresa y Madrid/Canarias/Levante. Incluye administrador, responsable y empleado nocturno, reglas estándar/partida/nocturna, calendario 2026, festivos y política de pausa manual visible.

**Resultado:** los dos perfiles se cargaron en PostgreSQL dedicado. `scripts/seed-demo.ts` materializa eventos completos, pausa, cruce de medianoche y entrada incompleta; durante los E2E se añadieron reintentos idempotentes, decisiones aprobada/rechazada y CSV/PDF. Sólo se usan identidades `@demo.test` y contraseñas sintéticas locales.

## Matriz de pruebas y resultado real

| Área | Casos | Resultado | Evidencia / bloqueo |
|---|---|---|---|
| Arranque limpio | Compose, PostgreSQL, health, migración, seed | Ejecutado | Dos proyectos Compose limpios, migrados y con health `ok`. |
| Calidad disponible | tests, smoke, tipo, build | Ejecutado | Build Docker, TypeScript y 66/66 pruebas en Node 20 Docker; las advertencias de trazado dinámico de exportaciones continúan como P2. |
| Autenticación/sesión/MFA | login, MFA administrativo, logout | Ejecutado | Login/logout web; setup y verificación TOTP administrativa `200`. |
| RBAC y acceso indebido | servidor, URL/API, responsable acotado | Ejecutado | Empleado positivo y denegaciones `403`; responsable limitado a un centro; ajuste de consulta SQL validado en UI. |
| Aislamiento y PII | entorno dedicado, errores y logs | Ejecutado parcialmente | Cookie de office rechazada por multicentro (`401`); logs revisados sin PII real. Falta proveedor/TLS/WAF. |
| Administración | centros, personas, reglas, vigencias, filtros | Ejecutado parcialmente | Dashboard, plantilla y correcciones visibles; configuración inicial sigue siendo API asistida. |
| Empleado | fichaje, pausas, historial, cálculo, corrección | Ejecutado | Vista responsive real, historial nocturno, formularios y solicitud de corrección E2E. |
| Casos complejos | partida, medianoche, DST, inválidos, reintentos | Ejecutado automatizado | Suites S3/S5 y E2E HTTP cubren DST, medianoche, secuencias y repetición; falta QR físico/rate limit real. |
| Correcciones y auditoría | inmutabilidad, decisión, recálculo, trazabilidad | Ejecutado | Aprobación y rechazo por API; aprobación web y efecto aditivo/recálculo solicitado. |
| Exportación | CSV/PDF, hash, descarga, roles, expiración | Ejecutado parcialmente | CSV/PDF autorizados, descarga y contenido validados; retención/borrado programado queda fuera. |
| UX/accesibilidad | móvil/tablet/escritorio, teclado, foco, contraste | Ejecutado parcialmente | Recorrido visual integrado, etiquetas y mensajes; pendiente lector de pantalla y aceptación humana. |

## Hallazgos y decisiones

| ID | Pri. | Hallazgo | Decisión S13 |
|---|---:|---|---|
| S13-001 / QA-001 | P1 corregido | Un empleado con sólo `employee` no podía fichar ni consultar sus datos. | Migración aditiva S13, E2E positivo/negativo y regresión. |
| S13-002 | P1 corregido | El host no cumplía Node y Docker no estaba disponible. | Node 20 Docker/Node 24 empaquetado y Compose saludable. |
| S13-003 | P1 corregido | Faltaba UI de acceso, MFA y logout. | Login, MFA y cierre de sesión disponibles y probados. |
| S13-004 | P1 corregido | Dataset E2E insuficiente. | Fixtures y seed ampliados; office/multisite ejecutados. |
| S13-005 | P1 abierto | No se han probado TLS/proxy/rate limit, restore real ni borrado de exportaciones vencidas. | Bloqueo operacional de S10/S12; no apto para datos reales hasta cerrarlo. |
| S13-006 | P2 | La UI administrativa entregada es de consulta/revisión; altas y configuración se ofrecen por API, no como flujo guiado. | La guía no inventa pantallas; decidir si se habilita UI o se documenta una operación técnica asistida. |
| S13-007 | P2 | La interfaz muestra UUID de regla/actor en detalles, poco comprensible para usuarios. | Mejora UX para S14 tras preservar trazabilidad. |

No se detectó P0. S13-005 permanece como P1 bloqueante para un piloto con datos reales.

## Riesgos, bloqueos y preparación de piloto

Riesgos abiertos: configuración laboral/calendario sin validación por asesoría; DPO/DPA/derechos/retención sin cierre; proveedor/TLS/cifrado en reposo y WAF sin aprobación; restore real no ensayado; QR físico no validado. No se verificó una fuga de PII, pero tampoco se pudo probar en tiempo de ejecución.

**Go / No-Go:** **NO-GO** para datos reales. Para cambiar a «listo con condiciones» deben cerrarse S13-005 y las aprobaciones legal, privacidad y operación de S10/S12.

## Criterios de aceptación S13

- [x] Entorno Docker limpio, migrado y dos perfiles demo ejecutados.
- [x] Flujos críticos E2E, roles, aislamiento, auditoría, exportaciones y casos temporales ejecutados.
- [x] Hallazgos, decisiones, riesgos y bloqueos documentados sin ocultar fallos.
- [x] Guía fiel a las pantallas reales y límites del producto creada.
- [x] Informe Go/No-Go y propuesta fuera de alcance creados.
