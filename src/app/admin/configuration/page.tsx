import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { config } from '@/shared/config';
import { currentActor } from '@/auth/service';
import { loginHref } from '@/auth/return-to';
import { Configuration } from '@/configuration/components';

export default async function ConfigurationPage(){const token=(await cookies()).get(config.SESSION_COOKIE_NAME)?.value??'';const actor=await currentActor(token);if(!actor)redirect(loginHref('/admin/configuration'));if(!['company.write','site.write','employee.write','employment.write','rule.write'].every((permission)=>actor.permissions.has(permission as never)))redirect('/admin');return <Configuration/>;}
