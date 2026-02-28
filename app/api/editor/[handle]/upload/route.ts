import { NextResponse } from 'next/server';
import { put, del } from '@vercel/blob';
import { prisma } from '@/lib/prisma';
import { requireProfileOwnership } from '@/lib/auth-helpers';

const MAX_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * POST /api/editor/[handle]/upload
 * Upload avatar or cover image via Vercel Blob Storage.
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

  // Upload new file
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `thisis-at/${handle}/${field}-${Date.now()}.${ext}`;

  const blob = await put(path, file, {
    access: 'public',
    contentType: file.type,
  });

  // Update profile
  await prisma.profile.update({
    where: { id: ownership.profile.id },
    data: { [field]: blob.url },
  });

  return NextResponse.json({ ok: true, url: blob.url });
}
