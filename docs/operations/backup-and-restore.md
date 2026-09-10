# Backup, restauración y evidencia

Cada cliente usa un directorio `BACKUP_DIRECTORY` exclusivo, fuera del repositorio y con cifrado en reposo del host/proveedor. La copia lógica se obtiene con `pg_dump` y se cifra localmente con AES-256-GCM; la clave se deriva con scrypt de `BACKUP_PASSPHRASE`. El fichero incluye sal e IV aleatorios y el `ENVIRONMENT_ID` como dato autenticado GCM. Antes de modificar PostgreSQL, restore rechaza un backup cuyo UUID de origen no coincide con el entorno dedicado destino. El manifiesto y SHA-256 permiten inventario y detección de corrupción accidental. No se registra la contraseña ni el contenido.

## Ejecución no interactiva

```powershell
docker compose --env-file ops/clients/<cliente>.env -p time-control-<cliente> -f docker-compose.yml -f docker-compose.ops.yml run --rm backup /ops/backup.sh backup-20260910T120000Z
# Restaurar SÓLO sobre el PostgreSQL dedicado objetivo; borra/recrea sus objetos.
$env:RESTORE_CONFIRM='replace-dedicated-database'
docker compose --env-file ops/clients/<cliente>.env -p time-control-<cliente> -f docker-compose.yml -f docker-compose.ops.yml run --rm backup /ops/restore.sh backup-20260910T120000Z
Remove-Item Env:RESTORE_CONFIRM
```

La restauración verifica SHA-256, autenticación GCM y el UUID de origen **antes** de cargar el dump; después comprueba de nuevo `environment_context`. Para una prueba segura, hágala primero en un proyecto Compose/volumen de restauración separado con el mismo `ENVIRONMENT_ID`, y conserve su registro de resultado. Una restauración sobre el entorno activo requiere incidencia aprobada y ventana de mantenimiento. Los backups con formato anterior `TCBKUP01` se rechazan: no se emitieron en piloto y no tienen garantía de identidad previa.

## Política operativa propuesta

Programar copia diaria y conservar al menos 35 diarias, 13 semanales y 13 mensuales, sujeto a validación DPO/contrato y a la retención laboral de cuatro años para registros. Probar restauración trimestral y tras cada cambio mayor; registrar cliente, ID de backup, hash, operador, hora, resultado y RTO/RPO observado, sin PII. La automatización de agenda y el repositorio de backup definitivo dependen del proveedor que se apruebe: son bloqueos explícitos antes del piloto.
