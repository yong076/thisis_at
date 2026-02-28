import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireProfileOwnership } from '@/lib/auth-helpers';

const VALID_TYPES = [
  'ARTIST', 'VENUE', 'CREATOR', 'BUSINESS',
  'INFLUENCER', 'PERSONAL', 'RESTAURANT', 'ORGANIZATION',
];

/**
 * PATCH /api/editor/[handle]/profile
 * Update profile basic info (displayName, bio, location, type, categoryId, isPublished).
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const ownership = await requireProfileOwnership(handle);

  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const body = await req.json();
  const {
    displayName,
    bio,
    location,
    type,
    categoryId,
    isPublished,
    avatarUrl,
    coverUrl,
  } = body as {
    displayName?: string;
    bio?: string;
    location?: string;
    type?: string;
    categoryId?: string | null;
    isPublished?: boolean;
    avatarUrl?: string;
    coverUrl?: string;
  };

  const updateData: Record<string, unknown> = {};

  if (displayName !== undefined) {
    const trimmed = displayName.trim();
    if (!trimmed) {
      return NextResponse.json({ error: '표시 이름을 입력해주세요.' }, { status: 400 });
    }
    updateData.displayName = trimmed;
  }

  if (bio !== undefined) {
    updateData.bio = bio.trim() || null;
  }

  if (location !== undefined) {
    updateData.location = location.trim() || null;
  }

  if (type !== undefined) {
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: '유효하지 않은 프로필 타입입니다.' }, { status: 400 });
    }
    updateData.type = type;
  }

  if (categoryId !== undefined) {
    if (categoryId === null || categoryId === '') {
      updateData.categoryId = null;
    } else {
      // Verify category exists
      const cat = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });
      if (!cat) {
        return NextResponse.json({ error: '유효하지 않은 카테고리입니다.' }, { status: 400 });
      }
      updateData.categoryId = categoryId;
    }
  }

  if (isPublished !== undefined) {
    updateData.isPublished = Boolean(isPublished);
  }

  if (avatarUrl !== undefined) {
    updateData.avatarUrl = avatarUrl || null;
  }

  if (coverUrl !== undefined) {
    updateData.coverUrl = coverUrl || null;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: '수정할 내용이 없습니다.' }, { status: 400 });
  }

  const profile = await prisma.profile.update({
    where: { id: ownership.profile.id },
    data: updateData,
    select: {
      id: true,
      handle: true,
      displayName: true,
      type: true,
      bio: true,
      location: true,
      avatarUrl: true,
      coverUrl: true,
      categoryId: true,
      isPublished: true,
    },
  });

  return NextResponse.json({ ok: true, profile });
}
