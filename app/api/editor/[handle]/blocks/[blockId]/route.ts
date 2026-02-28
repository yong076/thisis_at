import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireProfileOwnership } from '@/lib/auth-helpers';
import { validateBlockConfig } from '@/lib/validations/blocks';
import type { BlockType } from '@/lib/types';

/**
 * PATCH /api/editor/[handle]/blocks/[blockId]
 * Update a block's title, config, or enabled status.
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ handle: string; blockId: string }> },
) {
  const { handle, blockId } = await params;
  const ownership = await requireProfileOwnership(handle);

  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  // Verify block belongs to this profile
  const existing = await prisma.block.findUnique({
    where: { id: blockId },
    select: { id: true, profileId: true, type: true },
  });

  if (!existing || existing.profileId !== ownership.profile.id) {
    return NextResponse.json({ error: '블록을 찾을 수 없습니다.' }, { status: 404 });
  }

  const body = await req.json();
  const { title, config, enabled } = body as {
    title?: string;
    config?: Record<string, unknown>;
    enabled?: boolean;
  };

  // Build update data
  const updateData: Record<string, unknown> = {};

  if (title !== undefined) {
    updateData.title = title?.trim() || null;
  }

  if (enabled !== undefined) {
    updateData.isEnabled = Boolean(enabled);
  }

  if (config !== undefined) {
    const validation = validateBlockConfig(existing.type as BlockType, config);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    updateData.configJson = validation.data as object;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: '수정할 내용이 없습니다.' }, { status: 400 });
  }

  const block = await prisma.block.update({
    where: { id: blockId },
    data: updateData,
  });

  return NextResponse.json({
    ok: true,
    block: {
      id: block.id,
      type: block.type,
      title: block.title,
      config: block.configJson,
      order: block.sortOrder,
      enabled: block.isEnabled,
    },
  });
}

/**
 * DELETE /api/editor/[handle]/blocks/[blockId]
 * Delete a block.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ handle: string; blockId: string }> },
) {
  const { handle, blockId } = await params;
  const ownership = await requireProfileOwnership(handle);

  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  // Verify block belongs to this profile
  const existing = await prisma.block.findUnique({
    where: { id: blockId },
    select: { id: true, profileId: true },
  });

  if (!existing || existing.profileId !== ownership.profile.id) {
    return NextResponse.json({ error: '블록을 찾을 수 없습니다.' }, { status: 404 });
  }

  await prisma.block.delete({
    where: { id: blockId },
  });

  return NextResponse.json({ ok: true });
}
