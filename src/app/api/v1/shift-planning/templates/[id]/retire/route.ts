import { NextRequest } from 'next/server';
import { planningActor, planningFailure } from '@/shift-planning/http';
import { retireTemplate } from '@/shift-planning/service';
import { data } from '@/company-people/http';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await planningActor(request, 'shift-planning.write');
  if ('response' in auth) return auth.response;
  try {
    const { id } = await params;
    return data(await retireTemplate(id, { actor: auth.actor, correlationId: auth.cid }), auth.cid);
  } catch (value) {
    return planningFailure(value, auth.cid);
  }
}
