import Link from 'next/link';
import { SparkleLayer } from '@/components/public/sparkle-layer';
import { TopNav } from '@/components/public/top-nav';

export default function HomePage() {
  return (
    <>
      <SparkleLayer />
      <main className="page">
        <TopNav />
        <section className="card hero">
          <h1>Build your one-link mini site in minutes.</h1>
          <p className="subtitle">
            thisis.at connects your profile with trappist.app events, venue data, and conversion links.
          </p>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Link href="/@lucid.band" className="button-link" style={{ maxWidth: 280 }}>
              Open Demo Profile
            </Link>
            <Link href="/dashboard" className="button-link" style={{ maxWidth: 280 }}>
              Go to Dashboard
            </Link>
          </div>
        </section>
        <section className="simple-grid">
          <article className="card dash-card">
            <h2>Product Focus</h2>
            <p className="subtitle">One profile URL, block editor, trappist events read-sync, strong SEO and OG sharing.</p>
          </article>
          <article className="card dash-card">
            <h2>Trappist Integration</h2>
            <p className="subtitle">
              Keep ownership clean: thisis.at owns profile blocks. trappist owns events and places.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
