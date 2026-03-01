import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ blockId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { blockId } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.configJson !== undefined) updateData.configJson = body.configJson;
  if (body.isEnabled !== undefined) updateData.isEnabled = body.isEnabled;
  if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;

  const block = await prisma.block.update({
    where: { id: blockId },
    data: updateData,
  });

  return NextResponse.json({ ok: true, block });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ blockId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { blockId } = await params;

  await prisma.block.delete({ where: { id: blockId } });

  return NextResponse.json({ ok: true });
}
