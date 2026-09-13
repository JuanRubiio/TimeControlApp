# S15 — Cierre operativo y cumplimiento prepiloto

**Estado:** implementación interna parcial realizada el 13/09/2026; **NO-GO para datos reales** hasta cerrar evidencia externa y aprobaciones. **Tamaño:** M de ingeniería/operación, más plazos externos. **Dependencias:** S10, S12, proveedor, DPO, asesoría laboral y propietario del producto.

## Nombre y objetivo

Convertir los controles locales de S12 y el NO-GO de S13-005 en evidencia de operación segura para un entorno dedicado de piloto. No amplía el producto de control horario.

## Entregable verificable

Paquete de Go/No-Go con entorno no productivo dedicado, configuración TLS/proxy/WAF/rate limit/cifrado/secreto evidenciada; backup y restore aislados ejecutados con rechazo cruzado; tarea de retención/borrado de exportaciones probada y auditada; responsables, DPA, privacidad, laboral, soporte, incidentes y aceptación humana documentados.

## Alcance y exclusiones

Incluye provisión automatizada por cliente, prueba de health/aislamiento, RPO/RTO aprobados, backup/restore, retención de exportaciones, observabilidad minimizada, runbooks, QR físico, lector de pantalla, red del piloto, alta de cliente/demo sintético, soporte y canal de feedback minimizado. Excluye cambios de reglas de negocio, GPS, biometría, cámara, nómina, convenios, app nativa y cualquier dato real hasta aprobar el Go.

## Dominios, rutas, módulos, tablas y documentación afectados

Propietaria de `ops/`, `docker/ops`, Compose/plataforma, secretos gestionados, almacenamiento aislado, automatización de retención, CI/observabilidad y `docs/operations/*`, S10 y guía de piloto. No modifica tablas o rutas de S1–S9 salvo una integración transversal expresamente acordada para borrar físicamente un artefacto de exportación vencido conservando el manifiesto/auditoría.

## Dependencias y ejecución paralela

Depende de S12 y de la selección de proveedor. Puede correr en paralelo con auditoría S14; S16 sólo puede activar descarga visible cuando S15 cierre almacenamiento, vencimiento y auditoría. No comparte migraciones funcionales.

## Riesgos legales, técnicos y de integración

Los riesgos son pérdida o cruce de datos, fuerza bruta, restauración errónea, retención indebida y promesas de cumplimiento. Mitigación: evidencia repetible, principio de mínimo privilegio, prueba negativa de backup cruzado, DPA/DPO/laboral y decisión Go escrita. No constituye asesoramiento jurídico.

## Criterios de aceptación

- Entorno dedicado con app, PostgreSQL, secretos, exportaciones y backups aislados; TLS, HSTS/cabeceras, CORS/CSRF y WAF/rate limit probados en login, MFA, PIN, QR y API.
- Backup restaurado en destino de prueba, checksum e identidad de entorno verificados; backup de otro entorno rechazado antes de restaurar; RPO/RTO y rollback documentados.
- Exportación vencida se elimina físicamente por tarea controlada y deja manifiesto/auditoría; registros laborales se preservan conforme a política aprobada y bloqueo legal.
- DPA/subencargados/región, DPO, base jurídica, derechos, incidentes, contacto de soporte, asesoría laboral/calendario y responsables del cliente quedan aprobados por escrito.
- QR físico, teclado/lector de pantalla, red y recorridos de empleado/responsable se aceptan con datos sintéticos o según base autorizada.
- Feedback del piloto tiene canal, responsable, severidad y minimización de datos; no solicita credenciales, PIN, token ni datos innecesarios.

## Pruebas necesarias

Despliegue limpio, smoke autenticado, negativas de rate limit/RBAC/entorno, restauración y rechazo cruzado, expiración/borrado, revisión de logs, simulacro de incidente, QR físico y aceptación humana. Conservar evidencia sin secretos.

## Decisiones que requieren aprobación

Proveedor/región/coste, RPO/RTO, política de retención y bloqueo, responsables 24×7, DPA/subencargados, aprobación DPO/laboral, base y alcance de datos del piloto, y condición formal de Go.

## Registro de ejecución — 13/09/2026

### Base, dependencias y alcance realizado

- Base verificada: `master` limpio y sincronizado en `88b8c19`; S10/S12, S14 y S16–S20 están integradas. Se trabajó en `codex/s15-cierre-operativo-prepiloto`.
- Se implementó exclusivamente la integración transversal autorizada sobre S9: la retención física de artefactos de exportación. No se alteraron eventos laborales, correcciones, cálculo, RBAC, APIs de negocio ni migraciones funcionales.
- `src/exports/retention.ts` y `scripts/ops/expire-exports.ts` ejecutan una tarea serializada por entorno: seleccionan exportaciones disponibles ya vencidas, eliminan sólo su fichero UUID CSV/PDF dentro de `EXPORT_STORAGE_DIR`, cambian el estado a `expired` y añaden auditoría de sistema. El `snapshot`, manifiesto y hash de S9 permanecen en PostgreSQL. Un fichero ya ausente queda auditado como tal; una ruta inválida o fallo de almacenamiento no caduca la fila.
- Compose monta `EXPORT_STORAGE_DIRECTORY` del host dedicado únicamente en `/exports`; la plantilla de cliente exige una ruta de exportaciones distinta por cliente. No se crea bucket, proveedor, secreto ni cuenta externa.
- Se actualizaron runbook y despliegue técnico para programar la tarea con mínimo privilegio. La frecuencia, retención y bloqueo legal siguen sujetos a aprobación DPO/propietario.

### Archivos afectados

- Operación/configuración: `Dockerfile.ops`, `docker/ops/backup.sh`, `docker/ops/restore.sh`, `docker-compose.yml`, `ops/clients/client.example.env`, `package.json`, `scripts/ops/expire-exports.ts`, `scripts/ops/verify-export-retention.ts`, `src/exports/retention.ts`.
- Pruebas: `tests/export-retention.test.ts`, `tests/backup-script.test.ts`.
- Documentación: `docs/operations/runbooks.md`, `docs/operations/pilot-deployment.md`, este contrato, `README.md` del MVP, S10 y guía de piloto.

### Migración, seguridad y datos

No se añade migración: S9 ya define `exports.status`, `expired_at`, `manifest`, `snapshot` e índice de vencimiento. El recolector usa un bloqueo asesor de PostgreSQL para no ejecutarse en paralelo, restringe el nombre a UUID con extensión CSV/PDF y resuelve el destino bajo el único directorio del entorno. No incorpora PII adicional, no registra contenido, no borra registros laborales y no promete cumplimiento automático.

### Validación ejecutada

- Antes: `npm test -- tests/exports.test.ts tests/backup-crypto.test.ts` — 3/3 correctas.
- Después: `npx tsc --noEmit`, `npm test`, `docker compose --env-file .env.example config --quiet` y `git diff --check` — correctos; Vitest inicial: **110 pruebas en 31 ficheros**.
- `tests/export-retention.test.ts` usa un artefacto sintético temporal y comprueba borrado físico, tratamiento idempotente de fichero ausente y rechazo de claves que intenten salir del almacén dedicado.
- Ejecución real aislada: PostgreSQL fuente sintético migrado y sembrado; `npm run ops:verify-export-retention` confirmó `verified:true`, un artefacto borrado, una fila `expired`, manifiesto/snapshot conservados y una auditoría de sistema.
- Backup/restore real: se creó un backup cifrado con PostgreSQL 16; un destino aislado con el mismo `ENVIRONMENT_ID` restauró correctamente checksum, identidad y una exportación expirada. Otro destino, con UUID distinto, superó checksum pero fue rechazado por autenticación GCM antes de invocar `pg_restore`, y quedó sin tabla `environment_context`.
- Durante esta prueba se corrigieron dos defectos: `pg_dump` 15 contra servidor 16 podía crear un artefacto vacío por un pipeline sin `pipefail`; y restore verificaba checksum desde un directorio incorrecto y no aislaba el descifrado de `pg_restore`. `Dockerfile.ops` usa ahora PostgreSQL 16, backup falla y limpia artefactos parciales, y restore valida checksum/UUID antes de abrir el destino.
- Imagen Next.js actual: `docker compose build app` completó correctamente con Node 20.19.0; `docker run ... time-control:local npm test` ejecutó **113/113** pruebas. Se corrigió un P2 de empaquetado: la imagen incluía la suite pero no `Dockerfile.ops`, requerido por su prueba operativa. El runner incluye ahora ese fichero no sensible. Smoke HTTP autenticado sigue pendiente, pero no por un error de build.

### Riesgos, bloqueos y aprobación requerida

- Pendientes bloqueantes: proveedor/región/coste, proxy TLS/HSTS/CORS/CSRF/WAF/rate limit efectivos, cifrado en reposo gestionado, RPO/RTO y rollback aprobados, retención/bloqueo legal, DPA/subencargados, DPO, asesoría laboral, responsables 24×7, canal de derechos/incidentes, QR físico, lector de pantalla, red y aceptación humana.
- No se han creado ni simulado datos reales, aprobaciones humanas, proveedores, QR físico, revisión de lector de pantalla ni WAF/rate limit. Continúa el **NO-GO** y S16 no debe activar descarga visible.
- No hay defectos P0 confirmados. Permanece abierto el P1 S13-005 hasta disponer de evidencia externa y operativa completa. Persisten avisos P2 preexistentes de Turbopack: cuatro accesos dinámicos al almacenamiento de exportaciones (propiedad S9, posible impacto de tamaño) y el trazado Edge de `node:crypto` desde la instrumentación de cálculo (propiedad S5/S19). El build es correcto; ambos requieren una sesión propietaria si se decide resolverlos.
