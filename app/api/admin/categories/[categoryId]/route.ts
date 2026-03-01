import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { categoryId } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.slug !== undefined) updateData.slug = body.slug.trim();
  if (body.nameKo !== undefined) updateData.nameKo = body.nameKo.trim();
  if (body.icon !== undefined) updateData.icon = body.icon?.trim() || null;
  if (body.order !== undefined) updateData.order = body.order;

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: updateData,
  });

  return NextResponse.json({ ok: true, category });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { categoryId } = await params;

  // Check if any profiles are using this category
  const profileCount = await prisma.profile.count({
    where: { categoryId },
  });

  if (profileCount > 0) {
    return NextResponse.json(
      { error: `${profileCount}개의 프로필이 이 카테고리를 사용 중입니다. 먼저 프로필의 카테고리를 변경해주세요.` },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id: categoryId } });

  return NextResponse.json({ ok: true });
}
