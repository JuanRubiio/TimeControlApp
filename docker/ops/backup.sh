#!/usr/bin/env bash
set -euo pipefail
name="${1:?indique un nombre de backup}"
case "$name" in *[!A-Za-z0-9._-]*|'') echo 'Nombre de backup inválido.' >&2; exit 64;; esac
umask 077
artifact="/backups/${name}.dump.enc"
checksum="/backups/${name}.sha256"
manifest="/backups/${name}.json"
trap 'rm -f "$artifact" "$checksum" "$manifest"' ERR
pg_dump --format=custom --no-owner --no-privileges | node /ops/crypto-backup.mjs encrypt "$artifact"
printf '%s  %s\n' "$(sha256sum "$artifact" | awk '{print $1}')" "${name}.dump.enc" > "$checksum"
printf '{"backup":"%s.dump.enc","format":"pg_dump_custom","encryption":"AES-256-GCM+scrypt+authenticated-environment","verified":false}\n' "$name" > "$manifest"
echo "backup_created=${name}.dump.enc"
