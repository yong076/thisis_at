import type { Metadata } from 'next';
import { listCategories, listPublishedProfiles } from '@/lib/db';
import { DefaultShell } from '@/components/public/default-shell';
import { ExploreView } from '@/components/explore/explore-view';
import { getT } from '@/lib/i18n/server';

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: t('explore.meta.title'),
    description: t('explore.meta.description'),
  };
}

export default async function ExplorePage() {
  const [categories, profiles] = await Promise.all([
    listCategories(),
    listPublishedProfiles(),
  ]);

  return (
    <DefaultShell>
      <ExploreView categories={categories} profiles={profiles} />
    </DefaultShell>
  );
}
