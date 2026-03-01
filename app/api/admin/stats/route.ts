import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { getGlobalStats, getRecentSignups } from '@/lib/db/admin';

export async function GET() {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const [stats, recentSignups] = await Promise.all([
    getGlobalStats(),
    getRecentSignups(10),
  ]);

  return NextResponse.json({
    ...stats,
    recentSignups: recentSignups.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      profileCount: u._count.profiles,
    })),
  });
}
