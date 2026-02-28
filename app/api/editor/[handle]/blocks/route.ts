import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireProfileOwnership } from '@/lib/auth-helpers';
import { validateBlockConfig } from '@/lib/validations/blocks';
import type { BlockType } from '@/lib/types';

const VALID_BLOCK_TYPES: BlockType[] = [
  'LINK_BUTTON', 'SOCIAL_ROW', 'EMBED', 'TEXT_ANNOUNCEMENT',
  'MEDIA_GALLERY', 'EVENTS', 'PLACE_INFO', 'TICKET_CTA',
  'PRODUCT_CARDS', 'INSTAGRAM_EMBED', 'FAQ', 'BUSINESS_HOURS',
  'RICH_TEXT', 'TEAM_MEMBERS',
];

/**
 * GET /api/editor/[handle]/blocks
 * List all blocks for a profile (ordered by sortOrder).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const ownership = await requireProfileOwnership(handle);

  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const blocks = await prisma.block.findMany({
    where: { profileId: ownership.profile.id },
    orderBy: { sortOrder: 'asc' },
    select: {
      id: true,
      type: true,
      title: true,
      configJson: true,
      sortOrder: true,
      isEnabled: true,
    },
  });

  return NextResponse.json({
    ok: true,
    blocks: blocks.map((b) => ({
      id: b.id,
      type: b.type,
      title: b.title,
      config: b.configJson,
      order: b.sortOrder,
      enabled: b.isEnabled,
    })),
  });
}

/**
 * POST /api/editor/[handle]/blocks
 * Create a new block for the profile.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ handle: string }> },
) {
  const { handle } = await params;
  const ownership = await requireProfileOwnership(handle);

  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status });
  }

  const body = await req.json();
  const { type, title, config } = body as {
    type: string;
    title?: string;
    config?: Record<string, unknown>;
  };

  // Validate block type
  if (!VALID_BLOCK_TYPES.includes(type as BlockType)) {
    return NextResponse.json({ error: '유효하지 않은 블록 타입입니다.' }, { status: 400 });
  }

  const blockType = type as BlockType;

  // Validate config
  const configToSave = config ?? {};
  const validation = validateBlockConfig(blockType, configToSave);
  if (!validation.success) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  // Get max sortOrder to place the new block at the end
  const lastBlock = await prisma.block.findFirst({
    where: { profileId: ownership.profile.id },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true },
  });
  const nextOrder = (lastBlock?.sortOrder ?? -1) + 1;

  const block = await prisma.block.create({
    data: {
      profileId: ownership.profile.id,
      type: blockType,
      title: title?.trim() || null,
      configJson: validation.data as object,
      sortOrder: nextOrder,
      isEnabled: true,
    },
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
  }, { status: 201 });
}
