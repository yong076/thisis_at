import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/public/block-renderer';
import { ProfileHeader } from '@/components/public/profile-header';
import { SparkleLayer } from '@/components/public/sparkle-layer';
import { TopNav } from '@/components/public/top-nav';
import { getProfileByHandle } from '@/lib/mock-data';
import { normalizeHandle } from '@/lib/handle';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const profile = getProfileByHandle(params.handle);

  if (!profile) {
    return {
      title: 'Profile not found | thisis.at'
    };
  }

  return {
    title: `${profile.displayName} (@${profile.handle}) | thisis.at`,
    description: profile.bio,
    openGraph: {
      title: `${profile.displayName} (@${profile.handle})`,
      description: profile.bio,
      images: [{ url: `/api/og/@${profile.handle}` }]
    }
  };
}

export default function PublicProfilePage({ params }: { params: { handle: string } }) {
  const normalized = normalizeHandle(params.handle);
  const profile = getProfileByHandle(normalized);

  if (!profile) {
    notFound();
  }

  const blocks = profile.blocks.sort((a, b) => a.order - b.order);

  return (
    <>
      <SparkleLayer />
      <main className="page">
        <TopNav />
        <ProfileHeader profile={profile} />
        <section className="block-list">
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} events={profile.events} />
          ))}
        </section>
      </main>
    </>
  );
}
