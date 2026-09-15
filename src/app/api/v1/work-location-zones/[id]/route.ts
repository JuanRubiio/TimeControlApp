import { NextRequest } from 'next/server';
import { authenticated, data, missing } from '@/company-people/http';
import { error } from '@/auth/http';
import { deactivateZone, zoneHasActivePolicy } from '@/clocking-policy/service';

type Context = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, { params }: Context) {
  const access = await authenticated(request, 'clocking-policy.write');
  if ('response' in access) return access.response;
  const id = (await params).id;
  if (await zoneHasActivePolicy(id)) return error('ZONE_IN_USE', 'No se puede retirar una zona vinculada a una política vigente o futura.', 409, access.cid);
  const zone = await deactivateZone(id, access.actor.id, access.cid);
  return zone ? data(zone, access.cid) : missing(access.cid);
}
