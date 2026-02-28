import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlockRenderer } from '@/components/public/block-renderer';
import { ProfileHeader } from '@/components/public/profile-header';
import { ThemedProfileShell } from '@/components/public/themed-profile-shell';
import { AnalyticsTracker } from '@/components/public/analytics-tracker';
import { TrackedBlockWrapper } from '@/components/public/tracked-block-wrapper';
import { AnimatedBlock } from '@/components/public/animated-block';
import { VisitorCount } from '@/components/public/visitor-count';
import { getProfileByHandle } from '@/lib/db';
import { normalizeHandle } from '@/lib/handle';
import { getT } from '@/lib/i18n/server';

export async function generateMetadata({ params }: { params: { handle: string } }): Promise<Metadata> {
  const profile = await getProfileByHandle(params.handle);
  const t = getT();

  if (!profile) {
    return { title: t('profile.notFound') };
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

export default async function PublicProfilePage({ params }: { params: { handle: string } }) {
  const normalized = normalizeHandle(params.handle);
  const profile = await getProfileByHandle(normalized);

  if (!profile) {
    notFound();
  }

  const blocks = profile.blocks.sort((a, b) => a.order - b.order);
  const customization = profile.customization;

  return (
    <ThemedProfileShell
      themeId={customization?.themeId}
      fontBodyId={customization?.fontBody}
      fontDisplayId={customization?.fontDisplay}
      showSparkles={customization?.showSparkles}
      buttonStyle={customization?.buttonStyle}
      cardStyle={customization?.cardStyle}
    >
      <main className="page page--narrow">
        <header className="top-nav">
          <Link href="/" className="brand">
            thisis.at
          </Link>
        </header>

        <ProfileHeader profile={profile} />

        <AnalyticsTracker profileId={profile.id} />

        <section className="block-list">
          {blocks.map((block, i) => (
            <AnimatedBlock key={block.id} index={i}>
              <TrackedBlockWrapper profileId={profile.id} blockId={block.id} blockType={block.type}>
                <BlockRenderer block={block} events={profile.events} />
              </TrackedBlockWrapper>
            </AnimatedBlock>
          ))}
        </section>

        {profile.showVisitorCount && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <VisitorCount profileId={profile.id} />
          </div>
        )}

        <footer className="profile-footer">
          <p>
            <Link href="/">thisis.at</Link> {getT()('home.footer.madeWith')}
          </p>
        </footer>
      </main>
    </ThemedProfileShell>
  );
}
