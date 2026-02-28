'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeHandle, validateHandle } from '@/lib/handle';
import { redirect } from 'next/navigation';

export type CreateProfileState = {
  error?: string;
  success?: boolean;
  handle?: string;
};

export async function createProfile(
  _prevState: CreateProfileState,
  formData: FormData
): Promise<CreateProfileState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: '로그인이 필요합니다.' };
  }

  // Non-admin users can create up to 1 profile
  if (session.user.role !== 'ADMIN') {
    const count = await prisma.profile.count({
      where: { userId: session.user.id },
    });
    if (count >= 5) {
      return { error: '프로필은 최대 5개까지 생성할 수 있습니다.' };
    }
  }

  const rawHandle = (formData.get('handle') as string) ?? '';
  const displayName = (formData.get('displayName') as string) ?? '';
  const type = (formData.get('type') as string) ?? 'CREATOR';
  const bio = (formData.get('bio') as string) ?? '';

  // Validate handle
  const handle = normalizeHandle(rawHandle);
  const validation = validateHandle(handle);
  if (!validation.valid) {
    return { error: validation.reason ?? '유효하지 않은 핸들입니다.' };
  }

  // Validate display name
  if (!displayName.trim() || displayName.trim().length < 1) {
    return { error: '표시 이름을 입력해주세요.' };
  }

  // Validate type
  const validTypes = ['ARTIST', 'VENUE', 'CREATOR', 'BUSINESS', 'INFLUENCER', 'PERSONAL', 'RESTAURANT', 'ORGANIZATION'];
  if (!validTypes.includes(type)) {
    return { error: '유효하지 않은 프로필 타입입니다.' };
  }

  // Check uniqueness
  const existing = await prisma.profile.findUnique({
    where: { handle },
    select: { id: true },
  });

  if (existing) {
    return { error: `@${handle} 핸들은 이미 사용 중입니다.` };
  }

  // Create profile
  await prisma.profile.create({
    data: {
      owner: { connect: { id: session.user.id } },
      handle,
      displayName: displayName.trim(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: type as never,
      bio: bio.trim() || null,
      isPublished: false,
    },
  });

  redirect(`/editor/@${handle}`);
}

export async function checkHandleAvailability(
  handle: string
): Promise<{ available: boolean; reason?: string }> {
  const normalized = normalizeHandle(handle);
  const validation = validateHandle(normalized);

  if (!validation.valid) {
    return { available: false, reason: validation.reason };
  }

  const existing = await prisma.profile.findUnique({
    where: { handle: normalized },
    select: { id: true },
  });

  if (existing) {
    return { available: false, reason: '이미 사용 중인 핸들입니다.' };
  }

  return { available: true };
}
