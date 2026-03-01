import { NextResponse } from 'next/server';
import { getProfileByHandle } from '@/lib/db';
import { validateHandle } from '@/lib/handle';

export async function GET(_request: Request, { params }: { params: { handle: string } }) {
  const normalized = params.handle.replace(/^@/, '').toLowerCase();
  const validity = validateHandle(normalized);

  if (!validity.valid) {
    return NextResponse.json(
      {
        ok: false,
        error: validity.reason,
      },
      { status: 400 }
    );
  }

  const profile = await getProfileByHandle(normalized);

  if (!profile) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Profile not found'
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ok: true,
    data: profile
  }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
