import { NextRequest } from 'next/server';
import { authenticated,data } from '@/company-people/http';
import { OFFICIAL_HOLIDAY_SOURCES } from '@/holiday-sources/catalog';
export async function GET(request:NextRequest){const access=await authenticated(request,'shift-planning.write');if('response'in access)return access.response;return data(OFFICIAL_HOLIDAY_SOURCES,access.cid);}
