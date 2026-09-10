import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const [mode, target] = process.argv.slice(2);
const passphrase = process.env.BACKUP_PASSPHRASE;
const environmentId = process.env.ENVIRONMENT_ID;
if (!passphrase || passphrase.length < 20 || !target) throw new Error('BACKUP_PASSPHRASE (mín. 20 caracteres) y fichero destino son obligatorios.');
if (!environmentId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(environmentId)) throw new Error('ENVIRONMENT_ID UUID es obligatorio.');
const magic = Buffer.from('TCBKUP02');
const environmentBytes = Buffer.from(environmentId, 'ascii');
const keyFor = (salt) => scryptSync(passphrase, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
if (mode === 'encrypt') {
  const chunks = []; for await (const chunk of process.stdin) chunks.push(chunk);
  const salt = randomBytes(16), iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', keyFor(salt), iv);
  cipher.setAAD(environmentBytes);
  const encrypted = Buffer.concat([cipher.update(Buffer.concat(chunks)), cipher.final()]);
  writeFileSync(target, Buffer.concat([magic, environmentBytes, salt, iv, cipher.getAuthTag(), encrypted]), { mode: 0o600 });
} else if (mode === 'decrypt') {
  const input = readFileSync(target); if (!input.subarray(0, 8).equals(magic)) throw new Error('Formato de backup no reconocido.');
  const sourceEnvironment = input.subarray(8, 44).toString('ascii');
  if (sourceEnvironment !== environmentId) throw new Error('El backup no pertenece al ENVIRONMENT_ID de destino.');
  const salt = input.subarray(44, 60), iv = input.subarray(60, 72), tag = input.subarray(72, 88), payload = input.subarray(88);
  const decipher = createDecipheriv('aes-256-gcm', keyFor(salt), iv); decipher.setAAD(Buffer.from(sourceEnvironment, 'ascii')); decipher.setAuthTag(tag);
  process.stdout.write(Buffer.concat([decipher.update(payload), decipher.final()]));
} else throw new Error('Modo inválido.');
