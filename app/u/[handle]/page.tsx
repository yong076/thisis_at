import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/public/block-renderer';
import { ProfileHeader } from '@/components/public/profile-header';
import { SparkleLayer } from '@/components/public/sparkle-layer';
import { getProfileByHandle } from '@/lib/mock-data';
import { normalizeHandle } from '@/lib/handle';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const profile = getProfileByHandle(params.handle);

  if (!profile) {
    return { title: '프로필을 찾을 수 없습니다 | thisis.at' };
  }

  return {
    title: `${profile.displayName} (@${profile.handle}) | thisis.at`,
    description: profile.bio,
    openGraph: {
      title: `${profile.displayName} (@${profile.handle})`,
      description: profile.bio,
      images: [{ url: `/api/og/@${profile.handle}` }],
    },
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
      <main className="page page--narrow">
        <header className="top-nav">
          <Link href="/" className="brand">
            thisis.at
          </Link>
        </header>

        <ProfileHeader profile={profile} />

        <section className="block-list">
          {blocks.map((block) => (
            <BlockRenderer key={block.id} block={block} events={profile.events} />
          ))}
        </section>

        <footer className="profile-footer">
          <p>
            <Link href="/">thisis.at</Link> 으로 만들었습니다
          </p>
        </footer>
      </main>
    </>
  );
}
