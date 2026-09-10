import { z } from 'zod';
const schema = z.object({
  DATABASE_URL: z.string().url(), ENVIRONMENT_ID: z.string().uuid(),
  SESSION_COOKIE_NAME: z.string().regex(/^[A-Za-z0-9_-]+$/).default('tc_session'),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(24).default(8),
  SESSION_COOKIE_SECURE: z.enum(['true', 'false']).default('true').transform((value) => value === 'true')
});
export const config = schema.parse({ DATABASE_URL: process.env.DATABASE_URL, ENVIRONMENT_ID: process.env.ENVIRONMENT_ID, SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME, SESSION_TTL_HOURS: process.env.SESSION_TTL_HOURS, SESSION_COOKIE_SECURE: process.env.SESSION_COOKIE_SECURE });
