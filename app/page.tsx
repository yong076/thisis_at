import Link from 'next/link';
import { DefaultShell } from '@/components/public/default-shell';
import { TopNav } from '@/components/public/top-nav';

export default function HomePage() {
  return (
    <DefaultShell>
      <main className="page">
        <TopNav />

        {/* Hero */}
        <section className="card hero animate-fade-up">
          <h1>
            <span className="gradient-text">나의 세계,</span>
            <br />
            하나의 링크.
          </h1>
          <p className="hero-subtitle">
            몇 분 만에 나만의 링크 인 바이오 페이지를 만들어 보세요. 음악, 공연, 공간, 그리고 나를 표현하는 모든 것을
            하나로.
          </p>
          <div className="hero-actions">
            <Link href="/admin" className="button-primary">
              시작하기
            </Link>
            <Link href="/@lucid.band" className="button-secondary">
              데모 보기
            </Link>
          </div>
        </section>

        {/* Features */}
        <div className="feature-grid">
          <article className="card feature-card animate-fade-up animate-delay-1">
            <div className="feature-icon">🔗</div>
            <h3>모든 링크를 한곳에</h3>
            <p>
              YouTube, Spotify, Instagram, TikTok &mdash; 모든 링크를 하나의 예쁜 페이지에서 공유하세요.
            </p>
          </article>
          <article className="card feature-card animate-fade-up animate-delay-2">
            <div className="feature-icon">🎤</div>
            <h3>공연 &amp; 이벤트</h3>
            <p>
              trappist.app에서 다가오는 공연 정보를 자동으로 가져옵니다. 더 이상 일정 업데이트를 놓치지 마세요.
            </p>
          </article>
          <article className="card feature-card animate-fade-up animate-delay-3">
            <div className="feature-icon">✨</div>
            <h3>빛나는 디자인</h3>
            <p>
              화사한 테마, 반짝이는 효과, 무대 위의 나를 표현하는 디자인까지 전부.
            </p>
          </article>
        </div>

        {/* CTA */}
        <section className="card cta-section animate-fade-up animate-delay-4">
          <h2>
            <span className="gradient-text">나만의 페이지</span>를 만들어 볼까요?
          </h2>
          <p className="subtitle" style={{ maxWidth: 400, margin: '0 auto 1.5rem' }}>
            아티스트, 공연장, 크리에이터들이 하나의 링크로 세상과 소통하고 있습니다.
          </p>
          <Link href="/admin" className="button-primary">
            페이지 만들기
          </Link>
        </section>

        {/* Footer */}
        <footer className="profile-footer">
          <p>
            thisis.at &times; <a href="https://trappist.app">trappist.app</a>
          </p>
        </footer>
      </main>
    </DefaultShell>
  );
}
