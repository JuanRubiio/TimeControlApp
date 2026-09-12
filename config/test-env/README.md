# Perfiles locales de pruebas sintéticas

Estas plantillas son ejemplos versionados, sin secretos efectivos ni datos personales reales. `office` y `multisite` representan entornos dedicados distintos: tienen UUID, cookie y puertos locales separados para poder ejecutar pruebas de aislamiento sin compartir PostgreSQL.

Copie una plantilla a `.local/`, sustituya todos los valores `replace-...` por secretos sintéticos locales únicos y use siempre el mismo fichero junto con el mismo nombre de proyecto Compose:

```powershell
New-Item -ItemType Directory -Force .local
Copy-Item config/test-env/office.example.env .local/test-office.env
$Project='time-control-office'
$EnvFile='.local/test-office.env'
docker compose --project-name $Project --env-file $EnvFile up -d --build
docker compose --project-name $Project --env-file $EnvFile exec app npm run seed:demo
```

Para el segundo entorno, use `multisite.example.env`, `.local/test-multisite.env` y `time-control-multisite`. Los ficheros bajo `.local/` están ignorados; nunca los añada a Git ni los use fuera de Docker local con datos sintéticos.
