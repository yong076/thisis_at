import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireProfileOwnership } from '@/lib/auth-helpers';

/**
 * PATCH /api/editor/[handle]/blocks/reorder
 * Bulk update sortOrder for all blocks.
 * Body: { orderedIds: string[] }
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
  const { orderedIds } = body as { orderedIds: string[] };

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: '정렬할 블록 ID 목록이 필요합니다.' }, { status: 400 });
  }

  // Verify all block IDs belong to this profile
  const blocks = await prisma.block.findMany({
    where: { profileId: ownership.profile.id },
    select: { id: true },
  });
  const validIds = new Set(blocks.map((b) => b.id));

  for (const id of orderedIds) {
    if (!validIds.has(id)) {
      return NextResponse.json(
        { error: `블록 ${id}을(를) 찾을 수 없습니다.` },
        { status: 400 },
      );
    }
  }

  // Update all sortOrders in a transaction
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.block.update({
        where: { id },
        data: { sortOrder: index },
      }),
    ),
  );

  return NextResponse.json({ ok: true });
}
