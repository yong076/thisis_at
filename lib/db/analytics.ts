import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type DateRange = '7d' | '30d' | '90d' | 'all';

function getDateFilter(range: DateRange): Date | null {
  if (range === 'all') return null;
  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

function dateWhere(profileId: string, range: DateRange) {
  const since = getDateFilter(range);
  return {
    profileId,
    ...(since ? { createdAt: { gte: since } } : {}),
  };
}

// ─── Overview Stats ──────────────────────────────────────────────

export async function getOverviewStats(profileId: string, range: DateRange) {
  const where = dateWhere(profileId, range);

  const [totalViews, uniqueVisitors, totalClicks] = await Promise.all([
    prisma.pageView.count({ where }),
    prisma.pageView.groupBy({
      by: ['visitorHash'],
      where,
    }).then((r) => r.length),
    prisma.linkClick.count({ where: dateWhere(profileId, range) }),
  ]);

  return { totalViews, uniqueVisitors, totalClicks };
}

// ─── Views Over Time ─────────────────────────────────────────────

export async function getViewsOverTime(profileId: string, range: DateRange) {
  const since = getDateFilter(range);
  const sinceClause = since
    ? Prisma.sql`AND created_at >= ${since}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<{ date: string; views: bigint; uniques: bigint }>>`
    SELECT
      to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date,
      COUNT(*)::bigint as views,
      COUNT(DISTINCT visitor_hash)::bigint as uniques
    FROM page_views
    WHERE profile_id = ${profileId} ${sinceClause}
    GROUP BY date_trunc('day', created_at)
    ORDER BY date_trunc('day', created_at) ASC
  `;

  return rows.map((r) => ({
    date: r.date,
    views: Number(r.views),
    uniques: Number(r.uniques),
  }));
}

// ─── Clicks Over Time ────────────────────────────────────────────

export async function getClicksOverTime(profileId: string, range: DateRange) {
  const since = getDateFilter(range);
  const sinceClause = since
    ? Prisma.sql`AND created_at >= ${since}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<{ date: string; clicks: bigint }>>`
    SELECT
      to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as date,
      COUNT(*)::bigint as clicks
    FROM link_clicks
    WHERE profile_id = ${profileId} ${sinceClause}
    GROUP BY date_trunc('day', created_at)
    ORDER BY date_trunc('day', created_at) ASC
  `;

  return rows.map((r) => ({
    date: r.date,
    clicks: Number(r.clicks),
  }));
}

// ─── Device Breakdown ────────────────────────────────────────────

export async function getDeviceBreakdown(profileId: string, range: DateRange) {
  const where = dateWhere(profileId, range);

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

// ─── Browser Breakdown ───────────────────────────────────────────

export async function getBrowserBreakdown(profileId: string, range: DateRange) {
  const where = dateWhere(profileId, range);

  const groups = await prisma.pageView.groupBy({
    by: ['browserName'],
    where,
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
  });

  return groups.map((g) => ({
    browser: g.browserName || 'unknown',
    count: g._count.id,
  }));
}

// ─── Country Breakdown ───────────────────────────────────────────

export async function getCountryBreakdown(profileId: string, range: DateRange) {
  const where = dateWhere(profileId, range);

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

// ─── Top Referrers ───────────────────────────────────────────────

export async function getTopReferrers(profileId: string, range: DateRange) {
  const since = getDateFilter(range);
  const sinceClause = since
    ? Prisma.sql`AND created_at >= ${since}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<{ referrer: string; count: bigint }>>`
    SELECT
      COALESCE(
        CASE
          WHEN referrer IS NOT NULL AND referrer != '' THEN
            substring(referrer from '(?:https?://)?([^/]+)')
          ELSE 'direct'
        END,
        'direct'
      ) as referrer,
      COUNT(*)::bigint as count
    FROM page_views
    WHERE profile_id = ${profileId} ${sinceClause}
    GROUP BY 1
    ORDER BY count DESC
    LIMIT 15
  `;

  return rows.map((r) => ({
    referrer: r.referrer,
    count: Number(r.count),
  }));
}

// ─── UTM Campaigns ───────────────────────────────────────────────

export async function getUtmCampaigns(profileId: string, range: DateRange) {
  const since = getDateFilter(range);
  const sinceClause = since
    ? Prisma.sql`AND created_at >= ${since}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<{
    source: string | null;
    medium: string | null;
    campaign: string | null;
    count: bigint;
  }>>`
    SELECT
      utm_source as source,
      utm_medium as medium,
      utm_campaign as campaign,
      COUNT(*)::bigint as count
    FROM page_views
    WHERE profile_id = ${profileId}
      AND (utm_source IS NOT NULL OR utm_medium IS NOT NULL OR utm_campaign IS NOT NULL)
      ${sinceClause}
    GROUP BY utm_source, utm_medium, utm_campaign
    ORDER BY count DESC
    LIMIT 20
  `;

  return rows.map((r) => ({
    source: r.source || '-',
    medium: r.medium || '-',
    campaign: r.campaign || '-',
    count: Number(r.count),
  }));
}

// ─── Top Clicked Blocks ─────────────────────────────────────────

export async function getTopClickedBlocks(profileId: string, range: DateRange) {
  const since = getDateFilter(range);
  const sinceClause = since
    ? Prisma.sql`AND created_at >= ${since}`
    : Prisma.empty;

  const rows = await prisma.$queryRaw<Array<{
    block_id: string;
    block_type: string;
    label: string | null;
    clicks: bigint;
  }>>`
    SELECT
      block_id,
      block_type,
      (array_agg(label ORDER BY created_at DESC))[1] as label,
      COUNT(*)::bigint as clicks
    FROM link_clicks
    WHERE profile_id = ${profileId} ${sinceClause}
    GROUP BY block_id, block_type
    ORDER BY clicks DESC
    LIMIT 20
  `;

  return rows.map((r) => ({
    blockId: r.block_id,
    blockType: r.block_type,
    label: r.label || '-',
    clicks: Number(r.clicks),
  }));
}
