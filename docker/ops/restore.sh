#!/bin/sh
set -eu
name="${1:?indique un nombre de backup}"
[ "${RESTORE_CONFIRM:-}" = "replace-dedicated-database" ] || { echo 'Defina RESTORE_CONFIRM=replace-dedicated-database para restaurar.' >&2; exit 64; }
sha256sum -c "/backups/${name}.sha256"
node /ops/crypto-backup.mjs decrypt "/backups/${name}.dump.enc" | pg_restore --clean --if-exists --no-owner --no-privileges --dbname="$PGDATABASE"
actual_environment="$(psql --set=ON_ERROR_STOP=1 --tuples-only --no-align -c 'SELECT environment_id FROM environment_context WHERE singleton=true')"
[ "$actual_environment" = "$ENVIRONMENT_ID" ] || { echo 'El contexto restaurado no coincide con el entorno dedicado.' >&2; exit 65; }
echo "restore_verified=${name}.dump.enc"
