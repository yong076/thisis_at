import { notFound } from 'next/navigation';
import { SparkleLayer } from '@/components/public/sparkle-layer';
import { TopNav } from '@/components/public/top-nav';
import { getProfileByHandle } from '@/lib/mock-data';

export default function EditorPage({ params }: { params: { handle: string } }) {
  const profile = getProfileByHandle(params.handle);

  if (!profile) {
    notFound();
  }

  const blocks = profile.blocks.sort((a, b) => a.order - b.order);

  return (
    <>
      <SparkleLayer />
      <main className="page">
        <TopNav />
        <section className="card dash-card">
          <h1>Editor: @{profile.handle}</h1>
          <p className="subtitle">MVP editor shell with block ordering and on/off state preview.</p>
        </section>
        <section className="simple-grid" style={{ marginTop: '0.8rem' }}>
          {blocks.map((block) => (
            <article key={block.id} className="card dash-card">
              <h3 style={{ marginTop: 0 }}>
                {block.type} {block.enabled ? '' : '(disabled)'}
              </h3>
              <p className="subtitle">Order: {block.order}</p>
              <pre
                style={{
                  margin: 0,
                  padding: '0.8rem',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.15)',
                  overflowX: 'auto'
                }}
              >
                {JSON.stringify(block.config, null, 2)}
              </pre>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
