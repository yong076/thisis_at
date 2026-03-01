import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { profileId } = await params;

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      owner: { select: { name: true, email: true } },
      blocks: { orderBy: { sortOrder: 'asc' } },
      events: { orderBy: { startsAt: 'asc' } },
      category: true,
      _count: { select: { pageViews: true, linkClicks: true } },
    },
  });

  if (!profile) {
    return NextResponse.json({ error: '프로필을 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { profileId } = await params;
  const body = await req.json();

  const allowedFields = [
    'handle', 'displayName', 'type', 'bio', 'location',
    'isPublished', 'themeId', 'fontBody', 'fontDisplay',
    'customAccentColor', 'buttonStyle', 'cardStyle',
    'showSparkles', 'showVisitorCount', 'profileLayout',
  ];

  const updateData: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      updateData[key] = body[key];
    }
  }

  // If handle is being changed, check uniqueness
  if (updateData.handle) {
    const existing = await prisma.profile.findFirst({
      where: { handle: updateData.handle as string, NOT: { id: profileId } },
    });
    if (existing) {
      return NextResponse.json({ error: '이미 사용 중인 핸들입니다.' }, { status: 409 });
    }
  }

  const updated = await prisma.profile.update({
    where: { id: profileId },
    data: updateData,
  });

  return NextResponse.json({ ok: true, profile: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ profileId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { profileId } = await params;

  await prisma.profile.delete({ where: { id: profileId } });

  return NextResponse.json({ ok: true });
}
