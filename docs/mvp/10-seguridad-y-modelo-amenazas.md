# S10 — Seguridad, acceso técnico y modelo de amenazas

**Estado:** evaluación de cierre basada en revisión estática de S1–S12, 10/09/2026. No sustituye pentest, revisión de infraestructura o análisis de impacto.

## Matriz de acceso

| Actor | Acceso permitido | Límites |
|---|---|---|
| Empleado | su identidad, fichaje y registros propios | sin lectura de terceros ni administración |
| Responsable | ámbito de centros/personas asignados | sin roles, configuración global ni cruce de entorno |
| Administrador cliente | configuración autorizada del entorno | MFA obligatorio; no cruza clientes |
| Auditor | sólo lectura/exportación autorizada en ámbito | no ficha, configura ni aprueba |
| Soporte proveedor | sólo acceso temporal, aprobado, individual, mínimo y auditado | procedimiento aún pendiente de plataforma |
| Sistema/migrador | tarea técnica declarada | credenciales separadas y privilegios mínimos |

## Amenazas y tratamiento

| Amenaza | Impacto | Control actual | Pendiente |
|---|---|---|---|
| Acceso entre clientes | alto | entorno identificado en servidor, DB dedicada prevista, no tenant HTTP | IaC y prueba de aislamiento completo por S12 |
| Robo/reutilización de sesión | alto | token opaco hasheado, `HttpOnly`, `SameSite`, expiración/revocación | TLS/HSTS, rotación y detección de anomalía en producción |
| Escalada de privilegio | alto | RBAC/ámbito en servidor y denegación por defecto | recertificación y pruebas E2E de todos los roles |
| Manipular fichaje/auditoría | alto | append-only, privilegios DB y hash encadenado | verificación periódica de cadena, exportación verificable S9 |
| Fuerza bruta PIN/login | medio-alto | PIN bloquea tras 5 intentos 15 min; MFA | rate-limit/WAF/proxy y alertas, bloqueante piloto |
| Fuga por logs/exportación | alto | auditoría minimizada; PIN/QR no en claro; exportación requiere ámbito y hash | allowlist/revisión de todos los logs, eliminación física al expirar y DLP operativo |
| Backup perdido o acceso a copia | alto | S12 cifra `pg_dump` con AES-256-GCM/scrypt, checksum y directorio dedicado | IAM/cifrado de host, agenda, restauración real y borrado de backup |
| Restauración de copia de otro cliente | crítico | tras restaurar sólo se comprueba la existencia de `environment_context` | comparar de forma estricta el UUID restaurado con el entorno destino y probar rechazo cruzado |
| Dependencia vulnerable | medio-alto | `npm audit` realizado por S4 | CI, SBOM/actualización y revisión continua |
| Insider/soporte excesivo | alto | actor técnico/auditoría prevista | JIT, doble aprobación, revisión de accesos y runbook |
| Disponibilidad/ransomware | alto | Docker/PostgreSQL locales | backups inmutables/aislados, DR probado y objetivos RTO/RPO aprobados |

## Controles técnicos exigidos antes de producción

- TLS moderno extremo a extremo, HSTS y gestión de certificados; cifrado en reposo para DB, backups, exportaciones y secretos gestionados fuera del repositorio.
- Separación de credenciales de migrador, aplicación, backup y soporte; rotación, revocación y mínimo privilegio.
- Proxy/WAF con límite por IP/cuenta/kiosco para login, MFA, PIN, QR y APIs; CORS explícito y protección CSRF compatible con cookies.
- Cabeceras de seguridad, gestión de errores sin datos personales, logs estructurados minimizados y retención limitada de observabilidad.
- CI con análisis de dependencias, pruebas de autorización/SQL y revisión de secretos; no publicar `.env`, PIN, QR, tokens ni backups.
- Backups por cliente cifrados y acceso restringido, prueba de restauración y plan de continuidad con RTO/RPO acordados.

Estos son requisitos de seguridad derivados del riesgo (no evidencia actual de implementación). Cualquier cambio transversal en S1–S4 o plataforma debe acordarse con su sesión propietaria.
