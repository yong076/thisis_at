import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profiles: {
        select: { id: true, handle: true, displayName: true, type: true, isPublished: true },
        orderBy: { createdAt: 'desc' },
      },
      _count: { select: { profiles: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: '유저를 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    profiles: user.profiles,
    profileCount: user._count.profiles,
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { userId } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};

  if (body.role && ['USER', 'ADMIN'].includes(body.role)) {
    updateData.role = body.role;
  }

  if (body.name !== undefined) {
    updateData.name = body.name;
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return NextResponse.json({ ok: true, role: user.role });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { userId } = await params;

  // Prevent self-deletion
  if (userId === check.userId) {
    return NextResponse.json({ error: '자신의 계정은 삭제할 수 없습니다.' }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ ok: true });
}
