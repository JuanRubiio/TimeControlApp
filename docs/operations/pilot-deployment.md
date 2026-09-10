# Piloto: entorno dedicado por cliente

No crea infraestructura externa ni contrata proveedores. Esta plantilla debe ejecutarse sólo después de aprobación del proveedor/hosting, DPO y responsable del cliente.

## Parámetros y alta no interactiva

Un operador autorizado carga los valores secretos en el entorno de su consola/gestor de secretos y crea una única vez el fichero ignorado `ops/clients/<cliente>.env`:

```powershell
# Variables del entorno de la consola: CLIENT_SLUG, ENVIRONMENT_ID, FUTURE_DOMAIN,
# APP_IMAGE, APP_PORT, POSTGRES_SUPERUSER_PASSWORD, POSTGRES_PASSWORD,
# KIOSK_PIN_PEPPER, METRICS_BEARER_TOKEN, BACKUP_PASSPHRASE y BACKUP_DIRECTORY.
npm run ops:provision
docker build --build-arg BUILD_ENVIRONMENT_ID=<uuid-del-cliente> -t time-control:<cliente>-v1 .
docker compose --env-file ops/clients/<cliente>.env -p time-control-<cliente> up -d --no-build
docker compose --env-file ops/clients/<cliente>.env -p time-control-<cliente> exec -T app npm run db:migrate
```

El `CLIENT_SLUG`, el proyecto Compose, `ENVIRONMENT_ID`, imagen, puerto, contraseñas, pepper, token de métricas y directorio de backup son obligatorios y distintos para cada cliente. Esto separa contenedores/red/volúmenes, base, secretos y repositorio de copias. El almacenamiento futuro de exportaciones debe ser un bucket/ruta distinto por cliente; S9 será propietaria de conectarlo.

El script no genera, imprime ni sobrescribe secretos. Rechaza parámetros débiles e intenta crear el fichero con exclusividad; guárdelo en un gestor de secretos y aplique permisos del SO. El fichero local es un puente de piloto, no una solución de gestión de secretos definitiva.

## Actualización, migración, rollback y retirada

La imagen se etiqueta de forma inmutable (por ejemplo `time-control:cliente-v2`) antes de actualizar. Ejecute las pruebas, backup y migración en ese orden:

```powershell
docker compose --env-file ops/clients/<cliente>.env -p time-control-<cliente> -f docker-compose.yml -f docker-compose.ops.yml run --rm backup /ops/backup.sh backup-pre-v2
docker build --build-arg BUILD_ENVIRONMENT_ID=<uuid> -t time-control:<cliente>-v2 .
# Cambie APP_IMAGE en el gestor de secretos/parámetros, no en Git.
docker compose --env-file ops/clients/<cliente>.env -p time-control-<cliente> up -d --no-build
docker compose --env-file ops/clients/<cliente>.env -p time-control-<cliente> exec -T app npm run db:migrate
Invoke-WebRequest https://<dominio>/api/health
```

Rollback de aplicación: reponga el anterior `APP_IMAGE` inmutable y ejecute `up -d --no-build`. Las migraciones son aditivas: no se revierten esquemas ni se elimina evidencia. Si la compatibilidad no es suficiente, detenga el servicio y siga el restore dedicado. Retirada: confirme retención/bloqueo legal con DPO, archive la evidencia requerida, revocar secretos/accesos y luego `docker compose ... down -v`; nunca use este último paso sin la autorización documentada.

## TLS, proxy y alertas

Antes de datos reales, un proxy TLS aprobado debe terminar HTTPS, redirigir HTTP, establecer rate limit para login/MFA/PIN/QR/API y permitir únicamente `/api/health` a la sonda. No se incluye un proveedor cloud ni proxy final porque requieren aprobación y pueden generar coste. El recolector de métricas autenticado debe sondear `/api/metrics`; alertar por salud 5xx, errores estructurados, DB inaccesible, migración fallida, backup ausente/fallido y restore fallido. Nunca enviar cuerpos HTTP, cookies, emails ni secretos al observador central.
