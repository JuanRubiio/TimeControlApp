import { NextRequest } from 'next/server';
import { authenticated, data, invalid } from '@/company-people/http';
import { replacePolicy } from '@/clocking-policy/service';
import { policyInput } from '@/clocking-policy/validation';

type Context = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Context) {
  const access = await authenticated(request, 'clocking-policy.write');
  if ('response' in access) return access.response;
  const parsed = policyInput.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return invalid(access.cid);
  try { const policy = await replacePolicy((await params).id, parsed.data, access.actor.id, access.cid); return policy ? data(policy, access.cid) : invalid(access.cid); }
  catch { return data({ code: 'CONFLICT' }, access.cid, 409); }
}
