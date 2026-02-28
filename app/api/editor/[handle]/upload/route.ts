import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireProfileOwnership } from '@/lib/auth-helpers';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/editor/[handle]/upload
 * Upload avatar or cover image.
 * Uses Vercel Blob when BLOB_READ_WRITE_TOKEN is set, otherwise base64 data URL.
 * Body: multipart/form-data with "file" field and optional "field" (avatarUrl | coverUrl).
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

  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const field = (formData.get('field') as string) || 'avatarUrl';

  if (!file) {
    return NextResponse.json({ error: '파일이 필요합니다.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'JPG, PNG, WebP 이미지만 업로드할 수 있습니다.' },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: '파일 크기는 2MB 이하여야 합니다.' },
      { status: 400 },
    );
  }

  if (field !== 'avatarUrl' && field !== 'coverUrl') {
    return NextResponse.json({ error: '잘못된 필드입니다.' }, { status: 400 });
  }

  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Use Vercel Blob when token is available
    const { put, del } = await import('@vercel/blob');

    // Delete existing blob if present
    const currentProfile = await prisma.profile.findUnique({
      where: { id: ownership.profile.id },
      select: { avatarUrl: true, coverUrl: true },
    });

    const existingUrl = currentProfile?.[field];
    if (existingUrl && existingUrl.includes('.vercel-storage.com')) {
      try {
        await del(existingUrl);
      } catch {
        // ignore deletion errors
      }
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const path = `thisis-at/${handle}/${field}-${Date.now()}.${ext}`;
    const blob = await put(path, file, {
      access: 'public',
      contentType: file.type,
    });
    url = blob.url;
  } else {
    // Fallback: store as base64 data URL
    const buffer = Buffer.from(await file.arrayBuffer());
    url = `data:${file.type};base64,${buffer.toString('base64')}`;
  }

  // Update profile
  await prisma.profile.update({
    where: { id: ownership.profile.id },
    data: { [field]: url },
  });

  return NextResponse.json({ ok: true, url });
}
