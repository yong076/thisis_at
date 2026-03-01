import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { listAllEvents } from '@/lib/db/admin';

export async function GET(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 20));

  const result = await listAllEvents({ page, limit });

  return NextResponse.json({
    events: result.events.map((e) => ({
      id: e.id,
      title: e.title,
      startsAt: e.startsAt.toISOString(),
      venueName: e.venueName,
      ticketUrl: e.ticketUrl,
      createdAt: e.createdAt.toISOString(),
      profileId: e.profileId,
      profileHandle: e.profile.handle,
      profileName: e.profile.displayName,
    })),
    total: result.total,
    page,
    limit,
  });
}
