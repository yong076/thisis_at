import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { normalizeHandle, validateHandle } from '@/lib/handle';

export async function GET(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
  }

  const url = new URL(req.url);
  const rawHandle = url.searchParams.get('handle') ?? '';
  const handle = normalizeHandle(rawHandle);

  const validation = validateHandle(handle);
  if (!validation.valid) {
    return NextResponse.json({ available: false, reason: validation.reason });
  }

  const existing = await prisma.profile.findUnique({
    where: { handle },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ available: false, reason: '이미 사용 중인 핸들입니다.' });
  }

  return NextResponse.json({ available: true });
}
