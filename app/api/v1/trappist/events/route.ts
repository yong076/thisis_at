import { NextResponse } from 'next/server';
import { getEvents } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const artistId = searchParams.get('artist_id') ?? undefined;
  const placeId = searchParams.get('place_id') ?? undefined;
  const from = searchParams.get('from') ?? undefined;

  const events = await getEvents({
    artistId,
    placeId,
    from,
  });

  return NextResponse.json({
    ok: true,
    source: 'trappist.read-model.stub',
    data: events
  });
}
