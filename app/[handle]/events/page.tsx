import { notFound } from 'next/navigation';
import { SparkleLayer } from '@/components/public/sparkle-layer';
import { TopNav } from '@/components/public/top-nav';
import { getProfileByHandle } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/format';

export default function PublicEventsPage({ params }: { params: { handle: string } }) {
  const profile = getProfileByHandle(params.handle);

  if (!profile) {
    notFound();
  }

  return (
    <>
      <SparkleLayer />
      <main className="page">
        <TopNav />
        <section className="card dash-card">
          <h1>{profile.displayName} Events</h1>
          <p className="subtitle">/@{profile.handle}/events</p>
        </section>

        <section className="simple-grid" style={{ marginTop: '0.8rem' }}>
          {profile.events.map((event) => (
            <article key={event.id} className="card dash-card">
              <h3>{event.title}</h3>
              <p className="subtitle">
                {event.venueName} • {formatDateTime(event.startsAt)}
              </p>
              {event.ticketUrl ? (
                <a href={event.ticketUrl} className="button-link" target="_blank" rel="noreferrer noopener">
                  Ticket Link
                </a>
              ) : null}
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
