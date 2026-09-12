# Desarrollo local reproducible

## Precondiciones y secretos

Use Docker Desktop. Para pruebas sintéticas reproducibles copie `config/test-env/office.example.env` o `config/test-env/multisite.example.env` a `.local/`, sustituya cada valor `replace-...` por un secreto local único y conserve ese fichero fuera del control de versiones. `SESSION_COOKIE_SECURE=false` se permite únicamente para `localhost` HTTP; cualquier piloto exige `true` y TLS en el proxy que el cliente apruebe.

## Ciclo de trabajo

```powershell
$Project='time-control-office'
$EnvFile='.local/test-office.env'
docker compose --project-name $Project --env-file $EnvFile up --build -d
docker compose --project-name $Project --env-file $EnvFile ps
Invoke-WebRequest http://localhost:3013/api/health
docker compose --project-name $Project --env-file $EnvFile exec app npm run db:migrate
docker compose --project-name $Project --env-file $EnvFile exec app npm run seed:demo # exige DEMO_PASSWORD sintética
docker compose --project-name $Project --env-file $EnvFile exec app npm test
docker compose --project-name $Project --env-file $EnvFile down
```

`down` conserva PostgreSQL. Sólo `down -v` elimina la base local; es deliberadamente destructivo y no debe usarse para piloto. Los datos demo son sintéticos y el seeder impide mezclar empresas demo en una misma base.

## Conexión local con DBeaver

Con el contenedor `db` activo, PostgreSQL queda disponible para un cliente local en `127.0.0.1:${POSTGRES_PORT}`. En DBeaver cree una conexión PostgreSQL con base de datos `time_control`, usuario `mvp_app` y la contraseña local `POSTGRES_PASSWORD` de su fichero bajo `.local/`. Para operaciones de migración use el usuario `postgres` y `POSTGRES_SUPERUSER_PASSWORD` únicamente cuando sea necesario; no guarde esas credenciales en DBeaver compartido ni las use con datos reales.

Las plantillas asignan puertos explícitos (`office`: PostgreSQL `5433` y app `3013`; `multisite`: `5434` y `3014`). Para pruebas aisladas use el nombre de proyecto y fichero de entorno del mismo perfil, y al terminar ejecute `docker compose --project-name <nombre> --env-file <fichero-local> down --remove-orphans`; no use `down -v` salvo que quiera borrar deliberadamente esa base sintética.

## Diagnóstico local

`/api/health` devuelve 200 sólo si PostgreSQL responde. La salud de Docker de `db` usa `pg_isready` y la de `app` consulta ese endpoint. `npm run db:check` es una comprobación no interactiva de conexión. Los logs son JSON y los eventos de plataforma no incorporan email, tokens, cookies, contraseñas, pepper, secretos ni URL de conexión.
