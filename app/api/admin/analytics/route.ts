import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import {
  getTopProfilesByViews,
  getGlobalViewsOverTime,
  getGlobalCountryBreakdown,
  getGlobalDeviceBreakdown,
  type DateRange,
} from '@/lib/db/admin';

export async function GET(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const url = new URL(req.url);
  const range = (url.searchParams.get('range') || '30d') as DateRange;

  const [topProfiles, viewsOverTime, countryBreakdown, deviceBreakdown] = await Promise.all([
    getTopProfilesByViews(range, 15),
    getGlobalViewsOverTime(range),
    getGlobalCountryBreakdown(range),
    getGlobalDeviceBreakdown(range),
  ]);

  return NextResponse.json({
    topProfiles,
    viewsOverTime,
    countryBreakdown,
    deviceBreakdown,
  });
}
