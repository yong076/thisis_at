import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// ─── Global Stats ────────────────────────────────────────────────

export async function getGlobalStats() {
  const [totalUsers, totalProfiles, totalPageViews, totalLinkClicks] = await Promise.all([
    prisma.user.count(),
    prisma.profile.count(),
    prisma.pageView.count(),
    prisma.linkClick.count(),
  ]);

  return { totalUsers, totalProfiles, totalPageViews, totalLinkClicks };
}

export async function getRecentSignups(limit = 10) {
  return prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      _count: { select: { profiles: true } },
    },
  });
}

// ─── Users ───────────────────────────────────────────────────────

export async function listUsers(params: {
  page: number;
  limit: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}) {
  const { page, limit, search, sort = 'createdAt', order = 'desc' } = params;

  const where: Prisma.UserWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }
    : {};

  const orderBy: Prisma.UserOrderByWithRelationInput = { [sort]: order };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { profiles: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

// ─── Profiles (admin) ────────────────────────────────────────────

export async function listAllProfiles(params: {
  page: number;
  limit: number;
  search?: string;
  type?: string;
  published?: string;
}) {
  const { page, limit, search, type, published } = params;

  const where: Prisma.ProfileWhereInput = {};

  if (search) {
    where.OR = [
      { handle: { contains: search, mode: 'insensitive' } },
      { displayName: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (type) {
    where.type = type as Prisma.EnumProfileTypeFilter['equals'];
  }

  if (published === 'true') where.isPublished = true;
  if (published === 'false') where.isPublished = false;

  const [profiles, total] = await Promise.all([
    prisma.profile.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        handle: true,
        displayName: true,
        type: true,
        bio: true,
        avatarUrl: true,
        isPublished: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
        owner: { select: { name: true, email: true } },
        _count: { select: { blocks: true, pageViews: true, events: true } },
      },
    }),
    prisma.profile.count({ where }),
  ]);

  return { profiles, total };
}

// ─── Blocks (admin) ──────────────────────────────────────────────

export async function listAllBlocks(params: {
  page: number;
  limit: number;
  profileId?: string;
}) {
  const { page, limit, profileId } = params;

  const where: Prisma.BlockWhereInput = {};
  if (profileId) where.profileId = profileId;

  const [blocks, total] = await Promise.all([
    prisma.block.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        type: true,
        title: true,
        configJson: true,
        sortOrder: true,
        isEnabled: true,
        createdAt: true,
        profileId: true,
        profile: { select: { handle: true, displayName: true } },
      },
    }),
    prisma.block.count({ where }),
  ]);

  return { blocks, total };
}

// ─── Events (admin) ──────────────────────────────────────────────

export async function listAllEvents(params: {
  page: number;
  limit: number;
}) {
  const { page, limit } = params;

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      orderBy: { startsAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        startsAt: true,
        venueName: true,
        ticketUrl: true,
        createdAt: true,
        profileId: true,
        profile: { select: { handle: true, displayName: true } },
      },
    }),
    prisma.event.count(),
  ]);

  return { events, total };
}

// ─── Global Analytics ────────────────────────────────────────────

export type DateRange = '7d' | '30d' | '90d' | 'all';

function getDateFilter(range: DateRange): Date | null {
  if (range === 'all') return null;
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function getTopProfilesByViews(range: DateRange, limit = 20) {
  const since = getDateFilter(range);
  const sinceClause = since
    ? Prisma.sql`WHERE pv.created_at >= ${since}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<{
    profile_id: string;
    handle: string;
    display_name: string;
    views: bigint;
  }>>`
    SELECT
      pv.profile_id,
      p.handle,
      p.display_name,
      COUNT(*)::bigint as views
    FROM page_views pv
    JOIN profiles p ON p.id = pv.profile_id
    ${sinceClause}
    GROUP BY pv.profile_id, p.handle, p.display_name
    ORDER BY views DESC
    LIMIT ${limit}
  `;

  return rows.map((r) => ({
    profileId: r.profile_id,
    handle: r.handle,
    displayName: r.display_name,
    views: Number(r.views),
  }));
}

export async function getGlobalViewsOverTime(range: DateRange) {
  const since = getDateFilter(range);
  const sinceClause = since
    ? Prisma.sql`WHERE created_at >= ${since}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<{ date: string; views: bigint; uniques: bigint }>>`
    SELECT
      to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date,
      COUNT(*)::bigint as views,
      COUNT(DISTINCT visitor_hash)::bigint as uniques
    FROM page_views
    ${sinceClause}
    GROUP BY date_trunc('day', created_at)
    ORDER BY date_trunc('day', created_at) ASC
  `;

  return rows.map((r) => ({
    date: r.date,
    views: Number(r.views),
    uniques: Number(r.uniques),
  }));
}

export async function getGlobalCountryBreakdown(range: DateRange) {
  const since = getDateFilter(range);
  const where = since ? { createdAt: { gte: since } } : {};

  const groups = await prisma.pageView.groupBy({
    by: ['country'],
    where,
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 20,
  });

  return groups.map((g) => ({
    country: g.country || 'unknown',
    count: g._count.id,
  }));
}

export async function getGlobalDeviceBreakdown(range: DateRange) {
  const since = getDateFilter(range);
  const where = since ? { createdAt: { gte: since } } : {};

  const groups = await prisma.pageView.groupBy({
    by: ['deviceType'],
    where,
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  return groups.map((g) => ({
    device: g.deviceType || 'unknown',
    count: g._count.id,
  }));
}
