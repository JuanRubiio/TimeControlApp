# Time Control MVP

Monolito modular TypeScript/Next.js/PostgreSQL para control horario. La aplicación se ejecuta en un **entorno Docker dedicado por cliente**; no hay multitenancy compartido por filas, microservicios, app nativa, GPS ni biometría.

## Inicio local

Requiere Docker Desktop y Node 20.19+ si se ejecutan herramientas fuera del contenedor.

```powershell
Copy-Item .env.example .env
# Sustituya todos los valores `replace-...` por secretos locales únicos.
docker compose --env-file .env up --build -d
docker compose --env-file .env exec app npm run db:bootstrap-admin
Invoke-WebRequest http://localhost:3000/api/health
docker compose --env-file .env exec app npm test
docker compose --env-file .env down
```

No versionar `.env`, `ops/clients/*.env` ni backups. El único ejemplo seguro de parámetros de piloto está en [`ops/clients/client.example.env`](ops/clients/client.example.env). Para la guía completa, recuperación y operación, consultar [`docs/operations/`](docs/operations/).

## Verificación

```powershell
npm test
npx tsc --noEmit
npm run qa:smoke
docker compose --env-file .env config
```

`GET /api/health` comprueba aplicación y su PostgreSQL dedicado. `GET /api/metrics` expone sólo métricas técnicas agregadas y exige `Authorization: Bearer <METRICS_BEARER_TOKEN>` cuando el secreto está configurado.

El alcance, evidencias y riesgos de plataforma se mantienen en [`docs/mvp/12-despliegue-y-observabilidad.md`](docs/mvp/12-despliegue-y-observabilidad.md).
