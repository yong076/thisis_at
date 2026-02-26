import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SparkleLayer } from '@/components/public/sparkle-layer';
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
        {/* Nav */}
        <header className="admin-header">
          <Link href="/admin" className="brand">
            thisis.at
          </Link>
          <Link href={`/@${profile.handle}`} className="button-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
            프로필 보기
          </Link>
        </header>

        {/* Title */}
        <section className="card dash-card animate-fade-up" style={{ marginBottom: '1rem' }}>
          <h1>
            편집기: <span className="gradient-text">@{profile.handle}</span>
          </h1>
          <p className="subtitle">블록을 관리하세요. 드래그로 순서 변경, 표시 여부 토글이 가능합니다.</p>
        </section>

        {/* Block List */}
        <section className="simple-grid">
          {blocks.map((block, idx) => (
            <article
              key={block.id}
              className={`card editor-block animate-fade-up animate-delay-${Math.min(idx + 1, 4)}`}
            >
              <div className="editor-block-header">
                <span className="editor-block-type">{block.type.replace('_', ' ')}</span>
                <span
                  className="badge"
                  style={
                    block.enabled
                      ? { color: 'var(--accent-mint)', borderColor: 'rgba(52,211,153,0.2)' }
                      : { color: 'var(--text-muted)', borderColor: 'var(--line)' }
                  }
                >
                  {block.enabled ? '활성' : '비활성'}
                </span>
              </div>
              {block.title ? (
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem' }}>{block.title}</h3>
              ) : null}
              <p className="subtitle" style={{ marginBottom: '0.6rem', fontSize: '0.85rem' }}>
                순서: {block.order}
              </p>
              <pre className="editor-block"
                style={{
                  margin: 0,
                  padding: '0.8rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--line)',
                  background: 'rgba(139,92,246,0.04)',
                  overflowX: 'auto',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)',
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
