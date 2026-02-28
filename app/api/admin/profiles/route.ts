import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeHandle, validateHandle } from '@/lib/handle';

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  // Non-admin users can create up to 1 profile
  if (session.user.role !== 'ADMIN') {
    const count = await prisma.profile.count({
      where: { userId: session.user.id },
    });
    if (count >= 5) {
      return NextResponse.json({ error: '프로필은 최대 5개까지 생성할 수 있습니다.' }, { status: 403 });
    }
  }

  const body = await req.json();
  const { handle: rawHandle, displayName, type, bio } = body;

  // Validate handle
  const handle = normalizeHandle(rawHandle ?? '');
  const validation = validateHandle(handle);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.reason ?? '유효하지 않은 핸들입니다.' },
      { status: 400 }
    );
  }

  // Validate display name
  if (!displayName?.trim()) {
    return NextResponse.json({ error: '표시 이름을 입력해주세요.' }, { status: 400 });
  }

  // Validate type
  const validTypes = ['ARTIST', 'VENUE', 'CREATOR', 'BUSINESS', 'INFLUENCER', 'PERSONAL', 'RESTAURANT', 'ORGANIZATION'];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: '유효하지 않은 프로필 타입입니다.' }, { status: 400 });
  }

  // Check uniqueness
  const existing = await prisma.profile.findUnique({
    where: { handle },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json(
      { error: `@${handle} 핸들은 이미 사용 중입니다.` },
      { status: 409 }
    );
  }

  // Create profile
  const profile = await prisma.profile.create({
    data: {
      owner: { connect: { id: session.user.id } },
      handle,
      displayName: displayName.trim(),
      type,
      bio: bio?.trim() || null,
      isPublished: false,
    },
  });

  return NextResponse.json({
    ok: true,
    id: profile.id,
    handle: profile.handle,
  });
}
