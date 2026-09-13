import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { exportArtifactPath, removeExpiredArtifact } from '@/exports/retention';

const key = '11111111-1111-4111-8111-111111111111.csv';

describe('retención de exportaciones S15', () => {
  it('borra únicamente el artefacto vencido dentro del almacén dedicado', async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'time-control-exports-'));
    const artifact = exportArtifactPath(root, key);
    try {
      await writeFile(artifact, 'exportación sintética');
      expect(await removeExpiredArtifact(root, key)).toBe('deleted');
      await expect(readFile(artifact)).rejects.toMatchObject({ code: 'ENOENT' });
      expect(await removeExpiredArtifact(root, key)).toBe('missing');
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it('rechaza claves que puedan salir del directorio aislado', () => {
    expect(() => exportArtifactPath('C:/exports/client-a', '../other.csv')).toThrow('EXPORT_STORAGE_KEY_INVALID');
    expect(() => exportArtifactPath('C:/exports/client-a', 'not-an-export.txt')).toThrow('EXPORT_STORAGE_KEY_INVALID');
  });
});
