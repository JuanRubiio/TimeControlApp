#!/bin/sh
set -eu
name="${1:?indique un nombre de backup}"
case "$name" in *[!A-Za-z0-9._-]*|'') echo 'Nombre de backup inválido.' >&2; exit 64;; esac
umask 077
pg_dump --format=custom --no-owner --no-privileges | node /ops/crypto-backup.mjs encrypt "/backups/${name}.dump.enc"
printf '%s  %s\n' "$(sha256sum "/backups/${name}.dump.enc" | awk '{print $1}')" "${name}.dump.enc" > "/backups/${name}.sha256"
printf '{"backup":"%s.dump.enc","format":"pg_dump_custom","encryption":"AES-256-GCM+scrypt","verified":false}\n' "$name" > "/backups/${name}.json"
echo "backup_created=${name}.dump.enc"
