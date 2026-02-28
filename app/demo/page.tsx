import type { Metadata } from 'next';
import { getProfileByHandle } from '@/lib/db';
import { THEMES } from '@/lib/themes';
import { DemoView } from '@/components/demo/demo-view';

export const metadata: Metadata = {
  title: '테마 데모 | thisis.at',
  description: '30가지 테마를 실시간으로 미리보기',
};

// Serialize theme data for client (only what we need)
function serializeThemes() {
  return THEMES.map((t) => ({
    id: t.id,
    name: t.name,
    nameKo: t.nameKo,
    category: t.category,
    preview: t.preview,
  }));
}

export default async function DemoPage() {
  // Load both demo profiles
  const lucid = await getProfileByHandle('lucid.band');
  const moonlight = await getProfileByHandle('moonlight_hall');

  const profiles = [lucid, moonlight].filter((p): p is NonNullable<typeof p> => p !== null);
  const themes = serializeThemes();

  return <DemoView profiles={profiles} themes={themes} />;
}
