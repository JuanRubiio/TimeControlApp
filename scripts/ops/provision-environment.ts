import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

const schema = z.object({
  CLIENT_SLUG: z.string().regex(/^[a-z0-9-]{3,50}$/), ENVIRONMENT_ID: z.string().uuid(),
  FUTURE_DOMAIN: z.string().min(1), APP_IMAGE: z.string().min(1),
  APP_PORT: z.string().regex(/^\d{2,5}$/),
  POSTGRES_SUPERUSER_PASSWORD: z.string().min(20), POSTGRES_PASSWORD: z.string().min(20),
  KIOSK_PIN_PEPPER: z.string().min(32), METRICS_BEARER_TOKEN: z.string().min(20),
  BACKUP_PASSPHRASE: z.string().min(20), BACKUP_DIRECTORY: z.string().min(1),
  SESSION_COOKIE_NAME: z.string().regex(/^[A-Za-z0-9_-]+$/).default('tc_session'), SESSION_TTL_HOURS: z.string().default('8'), SESSION_COOKIE_SECURE: z.literal('true')
});
async function main() {
  const value = schema.parse(process.env);
  const output = path.join('ops', 'clients', `${value.CLIENT_SLUG}.env`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, Object.entries(value).map(([key, item]) => `${key}=${item}`).join('\n') + '\n', { encoding: 'utf8', mode: 0o600, flag: 'wx' });
  console.log(JSON.stringify({ provisioned: true, client: value.CLIENT_SLUG, config: output, secretsLogged: false }));
}
main().catch(() => { console.error('No se ha creado el entorno: parámetros inválidos o fichero ya existente.'); process.exitCode = 1; });
