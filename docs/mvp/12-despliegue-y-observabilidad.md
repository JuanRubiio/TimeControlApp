# S12 — Despliegue, observabilidad y documentación técnica

**Objetivo:** disponer de un piloto seguro, recuperable y operable. **Tamaño:** M. **Estado:** implementada localmente el 10/09/2026; no se ha desplegado ni contratado ningún proveedor externo.

## Alcance

CI/CD, imágenes Docker, plantilla de aprovisionamiento de entorno dedicado por cliente, configuración por entorno, gestión de secretos, infraestructura, monitorización, alertas, backups, restauración, runbook y documentación de operación. Logs estructurados con minimización de PII.

## Entregable y aceptación

Despliegue repetible de entorno piloto dedicado; secretos fuera de repositorio; aplicación, PostgreSQL, almacenamiento y backups aislados por cliente; alertas básicas; backup cifrado y restauración probada; runbook de incidentes y rollback.

## Dependencias y validación

Depende de S1 y ADR tecnológico de S0. Paralela con S2/S3/S4/S10/S11. Riesgo: no poder recuperar datos o registrar información sensible. Validación mediante despliegue limpio, prueba de restore y revisión de logs.

## Registro de implementación S12

### Archivos previstos y propiedad

S12 es propietaria de Docker/Compose de plataforma, `scripts/ops`, `docker/ops`, health/metrics transversales, README y `docs/operations`. No cambia tablas, módulos de dominio, rutas de negocio ni migraciones de S1–S4. La base de la rama es `TimeControlApp/master` `c5bef0b`; los ficheros previstos quedan enumerados en este registro antes de la edición.

### Entorno local y salud

- `Dockerfile` conserva el build reproducible Node 20 y `docker-compose.yml` inicia PostgreSQL 16 y la app. Ambos servicios tienen health check: `pg_isready` y `GET /api/health`.
- `/api/health` confirma conectividad con la base dedicada y no revela identificadores, usuarios ni configuración. `/api/metrics` expone sólo dos gauges agregados y se protege mediante bearer token si `METRICS_BEARER_TOKEN` está configurado.
- `.env.example` contiene sólo marcadores. `.env`, `ops/clients/*.env`, `ops/backups` y artefactos locales están ignorados. `README.md` y `docs/operations/local-development.md` documentan arranque, parada, migración, seed, tests y diagnóstico no interactivos.

### Entorno dedicado por cliente

La plantilla `ops/clients/client.example.env` exige slug, UUID de entorno, dominio futuro, imagen inmutable, puerto, contraseñas PostgreSQL, pepper PIN, token de métricas, contraseña de backup y directorio exclusivo. `npm run ops:provision` valida esos valores, no los registra y crea una vez un fichero ignorado; el gestor de secretos/controles de acceso del proveedor aprobado será la fuente de verdad antes de piloto.

Cada ejecución usa `docker compose --env-file ops/clients/<cliente>.env -p time-control-<cliente>`. El proyecto Compose, red y volumen PostgreSQL quedan separados; `ENVIRONMENT_ID` y la tabla singleton rechazan una base distinta; la imagen, secretos, directorio de backup y futuro almacenamiento de exportaciones son también exclusivos. No hay provisión cloud, dominio real, cuenta externa ni coste creado por esta sesión.

El alta, actualización, migración, rollback y retirada están descritos en `docs/operations/pilot-deployment.md`. Las migraciones existentes son versionadas y el migrador rechaza modificar una aplicada; el rollback es de aplicación mediante una etiqueta de imagen anterior, nunca borrado de evidencia/esquema.

### Backups, restore y observabilidad

`Dockerfile.ops` crea una imagen operativa local con cliente PostgreSQL. `docker/ops/backup.sh` hace `pg_dump` y cifra el resultado mediante `docker/ops/crypto-backup.mjs` con AES-256-GCM, clave derivada por scrypt, sal/IV aleatorios, tag autenticado y `ENVIRONMENT_ID` autenticado. Crea además checksum y manifiesto sin PII. `restore.sh` obliga a confirmar explícitamente y rechaza el UUID de origen incorrecto antes de tocar PostgreSQL; tras restaurar comprueba de nuevo el contexto del entorno. Los comandos y la política propuesta de retención/prueba están en `docs/operations/backup-and-restore.md`.

Los logs de plataforma son JSON con timestamp/nivel/evento; su filtro elimina claves de email, secretos, token, cookies, contraseña, pepper y URL de conexión. No hay cuerpos HTTP ni valores de negocio en las métricas. Las alertas mínimas propuestas son disponibilidad, error técnico, DB, migración, backup y restore; su configuración final depende del proxy/observador que se apruebe sin coste externo.

### Runbooks y relación con S10

`docs/operations/runbooks.md` cubre alta, actualización, incidencia, brecha, rollback, restore y rotación de secretos. Esta es la evidencia operativa que responde a los controles pendientes de S10:

| Control S10 | Evidencia S12 | Estado |
|---|---|---|
| Entornos/secretos/backups aislados | plantilla por cliente, proyecto Compose único, `.env` ignorado y directorio exclusivo | Implementado local; hosting/TLS pendiente de aprobación |
| Backup y restauración real | cifrado autenticado, checksum, confirmación y prueba de restore documentada | Automatización disponible; ejecutar simulacro de piloto |
| Rate limit/TLS/proxy | requisito operativo explícito y smoke de health/metrics | Bloqueante antes de datos reales |
| Incidentes y brechas | runbook con preservación, escalado DPO y minimización | Simulacro y contactos pendientes |
| Retención cuatro años | política propuesta y retirada condicionada a DPO | Job legal de retención no implementado, fuera de dominios actuales |

### Riesgos abiertos antes de piloto

1. Elegir y aprobar proveedor, región, TLS/proxy/WAF, cifrado de host, agenda de copias y gestor de secretos; no se ha decidido ni desplegado ninguno.
2. Ejecutar y conservar evidencia de un restore real en un entorno aislado, QR físico y rate limit del proxy.
3. Aprobar por DPO/abogado la retención, DPA, contactos 24×7, simulacro de brecha y el proceso de derechos.
4. S9 debe materializar almacenamiento aislado de exportaciones; S12 sólo reserva su requisito de plataforma.

### Validación ejecutada (10/09/2026)

- Correcto: `npx tsc --noEmit` en el host.
- Correcto: `npm test` y tipado dentro de un contenedor temporal con Node 20 y las dependencias Linux ya disponibles: **33 pruebas en 11 suites**, incluida la prueba S12 de exclusión de PII/secreto en observabilidad. El contenedor temporal se eliminó al finalizar y no se tocó el entorno Docker existente.
- Correcto: `docker compose --env-file .env config --quiet` y la combinación de `docker-compose.yml` + `docker-compose.ops.yml` con la plantilla de cliente pasan validación sintáctica.
- No ejecutable aún: build fresco de Dockerfile/Dockerfile.ops y smoke HTTP contra la nueva imagen. Docker Desktop no consiguió descargar dependencias durante `npm ci` (timeout de registry); el host usa Node 18.12, insuficiente para la versión de Vitest. Repetir con conectividad de registry antes del piloto.
- No ejecutable aún: backup/restore completo, porque exige la imagen operativa recién construida y un directorio de backup dedicado. La automatización, el cifrado autenticado y la comprobación de restore están revisados estáticamente; la simulación real sigue siendo un bloqueo antes de datos reales.

### Revisión de cierre tras S1–S12 (10/09/2026)

La revisión integrada en `master` detectó que un restore previo sólo verificaba `environment_context` tras sobrescribir el destino. S12 se ha actualizado para que cada backup `TCBKUP02` incorpore el `ENVIRONMENT_ID` de origen como dato autenticado AES-GCM y para que `restore.sh` lo compare **antes** de invocar `pg_restore`. Tras la carga se conserva una segunda comprobación del contexto de base. Un backup de otro entorno o un formato anterior se rechaza; la nueva prueba negativa de criptografía cubre ese caso sin necesitar PostgreSQL.

Resultado real de esta revisión: cifrado/descifrado con el UUID correcto y rechazo de UUID cruzado correctos mediante `node docker/ops/crypto-backup.mjs`. La ejecución completa de Vitest y del restore PostgreSQL queda pendiente de que Docker Desktop vuelva a estar disponible; el host continúa con Node 18.12, inferior al mínimo del proyecto.
