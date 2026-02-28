import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: Request, { params }: { params: { profileId: string } }) {
  const { profileId } = params;

  const count = await prisma.pageView.count({
    where: { profileId },
  });

  return NextResponse.json({ count });
}
