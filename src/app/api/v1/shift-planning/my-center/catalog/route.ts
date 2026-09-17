import { NextRequest } from 'next/server';
import { data, scopedSiteIds } from '@/company-people/http';
import { planningActor } from '@/shift-planning/http';
import { listTemplates } from '@/shift-planning/service';
import { listEmployments } from '@/company-people/service';

export async function GET(request:NextRequest){const auth=await planningActor(request,'shift-planning.publish:scope');if('response'in auth)return auth.response;const siteIds=scopedSiteIds(auth.actor);return data({templates:await listTemplates(siteIds),employments:await listEmployments(undefined,siteIds)},auth.cid);}
