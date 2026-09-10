import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const [mode, target] = process.argv.slice(2);
const passphrase = process.env.BACKUP_PASSPHRASE;
if (!passphrase || passphrase.length < 20 || !target) throw new Error('BACKUP_PASSPHRASE (mín. 20 caracteres) y fichero destino son obligatorios.');
const magic = Buffer.from('TCBKUP01');
const keyFor = (salt) => scryptSync(passphrase, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
if (mode === 'encrypt') {
  const chunks = []; for await (const chunk of process.stdin) chunks.push(chunk);
  const salt = randomBytes(16), iv = randomBytes(12), cipher = createCipheriv('aes-256-gcm', keyFor(salt), iv);
  const encrypted = Buffer.concat([cipher.update(Buffer.concat(chunks)), cipher.final()]);
  writeFileSync(target, Buffer.concat([magic, salt, iv, cipher.getAuthTag(), encrypted]), { mode: 0o600 });
} else if (mode === 'decrypt') {
  const input = readFileSync(target); if (!input.subarray(0, 8).equals(magic)) throw new Error('Formato de backup no reconocido.');
  const salt = input.subarray(8, 24), iv = input.subarray(24, 36), tag = input.subarray(36, 52), payload = input.subarray(52);
  const decipher = createDecipheriv('aes-256-gcm', keyFor(salt), iv); decipher.setAuthTag(tag);
  process.stdout.write(Buffer.concat([decipher.update(payload), decipher.final()]));
} else throw new Error('Modo inválido.');
