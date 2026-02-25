import Link from 'next/link';
import { listProfiles } from '@/lib/mock-data';
import { SparkleLayer } from '@/components/public/sparkle-layer';
import { TopNav } from '@/components/public/top-nav';

export default function DashboardPage() {
  const profiles = listProfiles();

  return (
    <>
      <SparkleLayer />
      <main className="page">
        <TopNav />
        <section className="card dash-card">
          <h1>Dashboard</h1>
          <p className="subtitle">Manage multiple profiles from one account.</p>
        </section>

        <section className="simple-grid" style={{ marginTop: '0.8rem' }}>
          {profiles.map((profile) => (
            <article key={profile.id} className="card dash-card">
              <h2>{profile.displayName}</h2>
              <p className="subtitle">
                @{profile.handle} • {profile.type}
              </p>
              <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                <Link className="button-link" href={`/@${profile.handle}`}>
                  View
                </Link>
                <Link className="button-link" href={`/editor/@${profile.handle}`}>
                  Edit
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
