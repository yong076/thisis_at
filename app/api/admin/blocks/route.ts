import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { listAllBlocks } from '@/lib/db/admin';

export async function GET(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 50));
  const profileId = url.searchParams.get('profileId') || undefined;

  const result = await listAllBlocks({ page, limit, profileId });

  return NextResponse.json({
    blocks: result.blocks.map((b) => ({
      id: b.id,
      type: b.type,
      title: b.title,
      configJson: b.configJson,
      sortOrder: b.sortOrder,
      isEnabled: b.isEnabled,
      createdAt: b.createdAt.toISOString(),
      profileId: b.profileId,
      profileHandle: b.profile.handle,
      profileName: b.profile.displayName,
    })),
    total: result.total,
    page,
    limit,
  });
}
