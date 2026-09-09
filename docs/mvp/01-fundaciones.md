# S1 — Fundaciones del proyecto

**Objetivo:** entregar la plataforma segura que soporta todos los dominios. **Tamaño:** L. **Ejecución:** secuencial tras S0.

## Alcance

Módulos previsibles: `auth`, `deployment-context`, `users`, `roles`, `permissions`, `audit`, migraciones base y configuración de secretos. Cada cliente se despliega en un entorno dedicado; no se implementa multitenancy compartido por filas. Incluye login, MFA para administración, RBAC en servidor y audit log append-only.

## Entregable y aceptación

Un usuario de una empresa nunca lee ni modifica recursos de otra; permisos se prueban en API; acciones administrativas se auditan; MFA funciona para administradores; base de auditoría no permite actualizaciones/borrados ordinarios.

## Dependencias y validación

Depende de S0. Bloquea S2–S10 y S12. Pruebas unitarias y de integración de autorización, aislamiento de tenant, sesiones y auditoría. Riesgo crítico: fuga intertenant o privilegio escalado.

## Registro de implementación S1 — 09/09/2026

Se ha creado el esqueleto ejecutable del monolito modular en `src/`, con límites públicos para `auth`, `permissions` y `audit`; `users` y `roles` se materializan como persistencia fundacional sin rutas de CRUD de negocio. Las rutas internas presentes son exclusivamente `/api/v1/auth/*` y `/api/v1/audit`.

### Decisiones concretadas

- El entorno dedicado se identifica mediante `ENVIRONMENT_ID` de configuración de servidor y la tabla singleton `environment_context`. Ninguna ruta acepta un identificador de cliente o tenant; una base cuyo identificador no coincida rechaza el arranque de la migración.
- Las sesiones llevan un token opaco aleatorio en cookie `HttpOnly`, con expiración, hash SHA-256 en PostgreSQL y revocación en servidor. No se devuelven secretos de sesión.
- Contraseñas: Argon2id. Administradores: contraseña seguida de TOTP MFA obligatorio; el desafío de MFA es de un solo uso y caduca a los cinco minutos. La recuperación auditada queda como extensión futura: no se entrega un mecanismo inseguro de recuperación en S1.
- RBAC se resuelve en servidor por permisos atómicos. El rol `admin` recibe el catálogo S0; ninguna comprobación se basa sólo en un rol enviado por UI.
- La aplicación se conecta como `mvp_app`, que sólo puede leer auditoría y ejecutar `audit_append`. La función, propiedad del migrador, encadena hashes y serializa inserciones; `UPDATE` y `DELETE` están revocados para el rol de aplicación.
- La migración `s001_202609091700_foundations.sql` se registra con checksum. Cambiar una migración aplicada aborta; las correcciones deben añadirse en otra migración.

### Operación local

1. Copiar `.env.example` a `.env` y sustituir todos los secretos y el UUID de entorno por valores locales únicos.
2. Ejecutar `docker compose up --build`. La app aplica migraciones como migrador y luego arranca como servicio; PostgreSQL crea el rol de aplicación sólo en un volumen nuevo.
3. Una vez arriba, ejecutar `docker compose exec app npm run db:bootstrap-admin` para crear la única cuenta inicial local. Su primer acceso obliga a enrolar MFA.
4. Ejecutar `docker compose exec app npm test` para las pruebas unitarias. Para detener el entorno: `docker compose down`; añadir `-v` sólo si se desea descartar explícitamente la base local.

`POSTGRES_SUPERUSER_PASSWORD`, `POSTGRES_PASSWORD`, UUID de entorno y credenciales de bootstrap son secretos operativos: `.env` está ignorado y no se versiona. S12 completará aprovisionamiento por cliente, almacenamiento aislado, backups/restauración y rollback automatizados; no se simulan en S1.

### Resultado de validación

- `npx tsc --noEmit`: correcto.
- `npm test`: 6 pruebas correctas: autorización con denegación por defecto, TOTP, y propiedades de migración/auditoría/ausencia de tabla multitenant.
- Build y pruebas de integración con PostgreSQL: bloqueados en esta máquina porque Docker Desktop no tiene disponible el motor `dockerDesktopLinuxEngine`. No es un fallo de la aplicación; queda pendiente ejecutar los comandos anteriores cuando el motor esté iniciado.
