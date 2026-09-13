#!/usr/bin/env bash
set -euo pipefail
name="${1:?indique un nombre de backup}"
[ "${RESTORE_CONFIRM:-}" = "replace-dedicated-database" ] || { echo 'Defina RESTORE_CONFIRM=replace-dedicated-database para restaurar.' >&2; exit 64; }
case "$name" in *[!A-Za-z0-9._-]*|'') echo 'Nombre de backup inválido.' >&2; exit 64;; esac
cd /backups
sha256sum -c "${name}.sha256"
umask 077
decrypted="$(mktemp)"
trap 'rm -f "$decrypted"' EXIT
# La autenticación GCM compara el UUID antes de que pg_restore pueda abrir el destino.
node /ops/crypto-backup.mjs decrypt "${name}.dump.enc" > "$decrypted"
pg_restore --clean --if-exists --no-owner --no-privileges --dbname="$PGDATABASE" "$decrypted"
actual_environment="$(psql --set=ON_ERROR_STOP=1 --tuples-only --no-align -c 'SELECT environment_id FROM environment_context WHERE singleton=true')"
[ "$actual_environment" = "$ENVIRONMENT_ID" ] || { echo 'El contexto restaurado no coincide con el entorno dedicado.' >&2; exit 65; }
echo "restore_verified=${name}.dump.enc"
