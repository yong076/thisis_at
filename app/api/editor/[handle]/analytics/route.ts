import { NextRequest, NextResponse } from 'next/server';
import { requireProfileOwnership } from '@/lib/auth-helpers';
import {
  getOverviewStats,
  getViewsOverTime,
  getClicksOverTime,
  getDeviceBreakdown,
  getBrowserBreakdown,
  getCountryBreakdown,
  getTopReferrers,
  getUtmCampaigns,
  getTopClickedBlocks,
} from '@/lib/db';
import type { DateRange } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: { handle: string } }) {
  const ownership = await requireProfileOwnership(params.handle);
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const profileId = ownership.profile.id;
  const range = (req.nextUrl.searchParams.get('range') || '30d') as DateRange;

  // Validate range
  if (!['7d', '30d', '90d', 'all'].includes(range)) {
    return NextResponse.json({ error: 'Invalid range' }, { status: 400 });
  }

  const [
    overview,
    viewsOverTime,
    clicksOverTime,
    devices,
    browsers,
    countries,
    referrers,
    campaigns,
    topBlocks,
  ] = await Promise.all([
    getOverviewStats(profileId, range),
    getViewsOverTime(profileId, range),
    getClicksOverTime(profileId, range),
    getDeviceBreakdown(profileId, range),
    getBrowserBreakdown(profileId, range),
    getCountryBreakdown(profileId, range),
    getTopReferrers(profileId, range),
    getUtmCampaigns(profileId, range),
    getTopClickedBlocks(profileId, range),
  ]);

  return NextResponse.json({
    overview,
    viewsOverTime,
    clicksOverTime,
    devices,
    browsers,
    countries,
    referrers,
    campaigns,
    topBlocks,
  });
}
