import Link from 'next/link';
import { DefaultShell } from '@/components/public/default-shell';
import { TopNav } from '@/components/public/top-nav';
import { getT } from '@/lib/i18n/server';

export default function HomePage() {
  const t = getT();

  return (
    <DefaultShell>
      <main className="page">
        <TopNav />

        {/* Hero */}
        <section className="card hero animate-fade-up">
          <h1>
            <span className="gradient-text">{t('home.hero.line1')}</span>
            <br />
            {t('home.hero.line2')}
          </h1>
          <p className="hero-subtitle">
            {t('home.hero.subtitle')}
          </p>
          <div className="hero-actions">
            <Link href="/admin" className="button-primary">
              {t('home.hero.cta')}
            </Link>
            <Link href="/demo" className="button-secondary">
              {t('home.hero.demo')}
            </Link>
          </div>
        </section>

        {/* Features */}
        <div className="feature-grid">
          <article className="card feature-card animate-fade-up animate-delay-1">
            <div className="feature-icon">🔗</div>
            <h3>{t('home.feature1.title')}</h3>
            <p>{t('home.feature1.desc')}</p>
          </article>
          <article className="card feature-card animate-fade-up animate-delay-2">
            <div className="feature-icon">🎤</div>
            <h3>{t('home.feature2.title')}</h3>
            <p>{t('home.feature2.desc')}</p>
          </article>
          <article className="card feature-card animate-fade-up animate-delay-3">
            <div className="feature-icon">✨</div>
            <h3>{t('home.feature3.title')}</h3>
            <p>{t('home.feature3.desc')}</p>
          </article>
        </div>

        {/* CTA */}
        <section className="card cta-section animate-fade-up animate-delay-4">
          <h2>
            <span className="gradient-text">{t('home.cta.title')}</span>{t('home.cta.suffix')}
          </h2>
          <p className="subtitle" style={{ maxWidth: 400, margin: '0 auto 1.5rem' }}>
            {t('home.cta.subtitle')}
          </p>
          <Link href="/admin" className="button-primary">
            {t('home.cta.button')}
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
