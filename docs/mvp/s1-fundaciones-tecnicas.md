# S1 — Nota técnica de fundaciones

## Límites y aislamiento

Cada despliegue usa un `docker-compose` y volumen PostgreSQL propios, con secretos propios. El `environmentId` no es una clave de particionado: es una aserción de configuración que la base singleton y el proceso migrador validan. Por tanto, S1 no crea `tenant_id`, tablas compartidas ni una selección de cliente desde HTTP.

En producción, cada cliente debe recibir su propia instancia de este conjunto, almacenamiento y plan de backup. La automatización de ese aprovisionamiento pertenece a S12; esta sesión no ha introducido ningún mecanismo compartido que lo contradiga.

## Auditoría

`audit_append` es el único canal de escritura de la identidad de ejecución. Conserva actor, recurso, resultado, correlación, origen minimizado y cambios estructurados sin secretos. La cadena `previous_hash`/`entry_hash` es determinista para el orden `occurred_at,id`. Las lecturas requieren `audit.read:scope` y también se auditan.

El rol migrador/propietario no se usa por la aplicación. La separación se comprueba en la migración mediante privilegios PostgreSQL: para `mvp_app`, auditoría permite `SELECT` y `EXECUTE audit_append`, nunca `INSERT`, `UPDATE` ni `DELETE`.

## Límites intencionados

No hay rutas ni tablas de empresas, centros, empleados, relaciones laborales, jornadas, fichajes o exportaciones. Las asignaciones de alcance `site` quedan como estructura de RBAC para S2, sin crear todavía el dominio de centros. Fechas técnicas se generan en PostgreSQL como `timestamptz` UTC; ninguna fecha laboral ni zona IANA se adelanta a S3/S4.
