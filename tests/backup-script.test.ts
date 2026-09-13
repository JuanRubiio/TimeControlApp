import { readFile } from 'node:fs/promises';
import { describe, expect, it } from 'vitest';

describe('backup operativo S15', () => {
  it('falla ante un pg_dump fallido en vez de publicar un artefacto parcial', async () => {
    const script = await readFile('docker/ops/backup.sh', 'utf8');
    expect(script).toContain('set -euo pipefail');
    expect(script).toContain("trap 'rm -f");
  });

  it('usa el cliente PostgreSQL 16 compatible con el servidor dedicado', async () => {
    const dockerfile = await readFile('Dockerfile.ops', 'utf8');
    expect(dockerfile).toContain('FROM postgres:16.6-bookworm');
    expect(dockerfile).toContain('ENTRYPOINT ["/bin/bash"]');
  });

  it('verifica checksum e identidad antes de abrir pg_restore', async () => {
    const script = await readFile('docker/ops/restore.sh', 'utf8');
    expect(script).toContain('cd /backups');
    expect(script).toContain('node /ops/crypto-backup.mjs decrypt "${name}.dump.enc" > "$decrypted"');
    expect(script.indexOf('crypto-backup.mjs decrypt')).toBeLessThan(script.indexOf('pg_restore --clean'));
  });
});
