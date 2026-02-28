import { prisma } from '@/lib/prisma';
import type { ProfileCategory, PublicProfile } from '@/lib/types';
import { toPublicProfile } from './profiles';

export async function listCategories(): Promise<(ProfileCategory & { id: string })[]> {
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
  });

  return categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameKo: c.nameKo,
    icon: c.icon ?? undefined,
  }));
}

export async function listPublishedProfiles(categorySlug?: string): Promise<PublicProfile[]> {
  const where: Record<string, unknown> = { isPublished: true };

  if (categorySlug && categorySlug !== 'all') {
    where.category = { slug: categorySlug };
  }

  const profiles = await prisma.profile.findMany({
    where,
    include: {
      blocks: { orderBy: { sortOrder: 'asc' } },
      events: { orderBy: { startsAt: 'asc' } },
      category: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return profiles.map(toPublicProfile);
}
