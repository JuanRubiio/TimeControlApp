import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const sourceEnvironment = '11111111-1111-4111-8111-111111111111';
const otherEnvironment = '22222222-2222-4222-8222-222222222222';
const passphrase = 'local-test-passphrase-with-enough-entropy';

function run(mode: 'encrypt' | 'decrypt', target: string, environmentId: string, input?: Buffer) {
  return spawnSync(process.execPath, ['docker/ops/crypto-backup.mjs', mode, target], { input, encoding: 'buffer', env: { ...process.env, BACKUP_PASSPHRASE: passphrase, ENVIRONMENT_ID: environmentId } });
}

describe('backup cifrado por entorno dedicado', () => {
  it('recupera el backup sólo para el ENVIRONMENT_ID autenticado de origen', async () => {
    const directory = await mkdtemp(path.join(tmpdir(), 'time-control-backup-'));
    const artifact = path.join(directory, 'backup.dump.enc');
    try {
      expect(run('encrypt', artifact, sourceEnvironment, Buffer.from('pg-dump-fixture')).status).toBe(0);
      expect((await readFile(artifact)).subarray(8, 44).toString('ascii')).toBe(sourceEnvironment);
      expect(run('decrypt', artifact, sourceEnvironment).stdout.toString()).toBe('pg-dump-fixture');
      expect(run('decrypt', artifact, otherEnvironment).status).not.toBe(0);
    } finally { await rm(directory, { recursive: true, force: true }); }
  });
});
