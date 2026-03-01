import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { profiles: true } } },
  });

  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      nameKo: c.nameKo,
      icon: c.icon,
      order: c.order,
      profileCount: c._count.profiles,
    })),
  });
}

export async function POST(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const body = await req.json();
  const { slug, nameKo, icon, order } = body;

  if (!slug?.trim() || !nameKo?.trim()) {
    return NextResponse.json({ error: 'slug와 이름은 필수입니다.' }, { status: 400 });
  }

  const existing = await prisma.category.findUnique({ where: { slug: slug.trim() } });
  if (existing) {
    return NextResponse.json({ error: '이미 존재하는 slug입니다.' }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      slug: slug.trim(),
      nameKo: nameKo.trim(),
      icon: icon?.trim() || null,
      order: order ?? 0,
    },
  });

  return NextResponse.json({ ok: true, category });
}
