import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeHandle } from '@/lib/handle';

export type OwnershipResult = {
  ok: true;
  profile: { id: string; userId: string; handle: string };
  userId: string;
  isAdmin: boolean;
} | {
  ok: false;
  status: number;
  error: string;
};

/**
 * Check that the current session user owns the profile (or is ADMIN).
 * Returns the profile and userId on success, or an error response object.
 */
export async function requireProfileOwnership(rawHandle: string): Promise<OwnershipResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, status: 401, error: '로그인이 필요합니다.' };
  }

  const handle = normalizeHandle(rawHandle);
  const profile = await prisma.profile.findUnique({
    where: { handle },
    select: { id: true, userId: true, handle: true },
  });

  if (!profile) {
    return { ok: false, status: 404, error: '프로필을 찾을 수 없습니다.' };
  }

  const isAdmin = session.user.role === 'ADMIN';

  if (profile.userId !== session.user.id && !isAdmin) {
    return { ok: false, status: 403, error: '이 프로필에 대한 권한이 없습니다.' };
  }

  return { ok: true, profile, userId: session.user.id, isAdmin };
}
