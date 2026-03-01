import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireProfileOwnership } from '@/lib/auth-helpers';
import { uploadToR2, deleteFromR2 } from '@/lib/r2';

const PROFILE_MAX_SIZE = 2 * 1024 * 1024; // 2 MB (avatar / cover)
const BLOCK_MAX_SIZE = 5 * 1024 * 1024; // 5 MB (block images)
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const VALID_FIELDS = ['avatarUrl', 'coverUrl', 'blockImage'] as const;
type UploadField = (typeof VALID_FIELDS)[number];

function randomId() {
  return Math.random().toString(36).slice(2, 8);
}

/**
 * POST /api/editor/[handle]/upload
 * Upload avatar, cover, or block image to Cloudflare R2.
 * Body: multipart/form-data with "file" and "field" (avatarUrl | coverUrl | blockImage).
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

  if (!VALID_FIELDS.includes(field as UploadField)) {
    return NextResponse.json({ error: '잘못된 필드입니다.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: 'JPG, PNG, WebP 이미지만 업로드할 수 있습니다.' },
      { status: 400 },
    );
  }

  const maxSize = field === 'blockImage' ? BLOCK_MAX_SIZE : PROFILE_MAX_SIZE;
  if (file.size > maxSize) {
    const mb = maxSize / (1024 * 1024);
    return NextResponse.json(
      { error: `파일 크기는 ${mb}MB 이하여야 합니다.` },
      { status: 400 },
    );
  }

  // Determine R2 key
  const ext = file.name.split('.').pop() || 'jpg';
  let key: string;

  if (field === 'blockImage') {
    key = `thisis-at/${handle}/blocks/${Date.now()}-${randomId()}.${ext}`;
  } else {
    key = `thisis-at/${handle}/${field}-${Date.now()}.${ext}`;
  }

  // Check if R2 is configured
  if (!process.env.R2_ACCOUNT_ID) {
    // Fallback: base64 data URL (dev mode)
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = `data:${file.type};base64,${buffer.toString('base64')}`;

    if (field !== 'blockImage') {
      await prisma.profile.update({
        where: { id: ownership.profile.id },
        data: { [field]: url },
      });
    }

    return NextResponse.json({ ok: true, url });
  }

  // Delete existing image for avatar/cover
  if (field !== 'blockImage') {
    const currentProfile = await prisma.profile.findUnique({
      where: { id: ownership.profile.id },
      select: { avatarUrl: true, coverUrl: true },
    });

    const existingUrl = currentProfile?.[field as 'avatarUrl' | 'coverUrl'];
    if (existingUrl) {
      await deleteFromR2(existingUrl);
    }
  }

  // Upload to R2
  const url = await uploadToR2(file, key);

  // Update DB for avatar/cover (block images are stored in configJson by the client)
  if (field !== 'blockImage') {
    await prisma.profile.update({
      where: { id: ownership.profile.id },
      data: { [field]: url },
    });
  }

  return NextResponse.json({ ok: true, url });
}
