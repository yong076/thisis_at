import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { listUsers } from '@/lib/db/admin';

export async function GET(req: Request) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get('limit')) || 20));
  const search = url.searchParams.get('search') || undefined;
  const sort = url.searchParams.get('sort') || 'createdAt';
  const order = (url.searchParams.get('order') || 'desc') as 'asc' | 'desc';

  const result = await listUsers({ page, limit, search, sort, order });

  return NextResponse.json({
    users: result.users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      updatedAt: u.updatedAt.toISOString(),
      profileCount: u._count.profiles,
    })),
    total: result.total,
    page,
    limit,
  });
}
