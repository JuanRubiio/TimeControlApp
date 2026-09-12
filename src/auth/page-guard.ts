import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { config } from '@/shared/config';
import { currentActor } from './service';
import { loginHref } from './return-to';

/** Server-only page boundary. API endpoints retain their JSON 401/403 contract. */
export async function requirePageSession(returnTo: string) {
  const token = (await cookies()).get(config.SESSION_COOKIE_NAME)?.value ?? '';
  const actor = await currentActor(token);
  if (actor) return actor;
  redirect(loginHref(returnTo));
}
