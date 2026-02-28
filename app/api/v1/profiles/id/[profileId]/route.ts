import { NextResponse } from 'next/server';
import { getProfileById } from '@/lib/db';

export async function GET(_request: Request, { params }: { params: { profileId: string } }) {
  const profile = await getProfileById(params.profileId);

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
  });
}
