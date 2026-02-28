import Link from 'next/link';
import { DefaultShell } from '@/components/public/default-shell';
import { TopNav } from '@/components/public/top-nav';
import { ScrollReveal } from '@/components/public/scroll-reveal';
import { getT } from '@/lib/i18n/server';

export default function HomePage() {
  const t = getT();

  return (
    <DefaultShell>
      <main className="page">
        <TopNav />

        {/* Hero */}
        <section className="hero">
          <ScrollReveal>
            <h1>
              <span className="gradient-text">{t('home.hero.line1')}</span>
              <br />
              {t('home.hero.line2')}
            </h1>
            <p className="hero-subtitle">
              {t('home.hero.subtitle')}
            </p>
            <div className="hero-actions">
              <Link href="/admin" className="button-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', borderRadius: '16px' }}>
                {t('home.hero.cta')}
              </Link>
              <Link href="/demo" className="button-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', borderRadius: '16px' }}>
                {t('home.hero.demo')}
              </Link>
            </div>
          </ScrollReveal>

          <ScrollReveal delay="200">
            <div className="showcase-mockup">
              <iframe
                src="/lucid.band"
                title="LUCID BAND Demo Profile"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  background: 'var(--bg-base)'
                }}
              />
            </div>
          </ScrollReveal>
        </section>

        {/* Bento Grid Features */}
        <div className="bento-grid" style={{ marginBottom: '4rem' }}>
          <ScrollReveal delay="100" className="bento-item col-span-2">
            <div className="bento-icon">🔗</div>
            <h3>{t('home.feature1.title')}</h3>
            <p style={{ maxWidth: '400px' }}>{t('home.feature1.desc')}</p>
          </ScrollReveal>

          <ScrollReveal delay="200" className="bento-item">
            <div className="bento-icon">🎨</div>
            <h3>{t('home.feature4.title')}</h3>
            <p>{t('home.feature4.desc')}</p>
          </ScrollReveal>

          <ScrollReveal delay="300" className="bento-item">
            <div className="bento-icon">📊</div>
            <h3>{t('home.feature5.title')}</h3>
            <p>{t('home.feature5.desc')}</p>
          </ScrollReveal>

          <ScrollReveal delay="400" className="bento-item col-span-2">
            <div className="bento-icon">🎤</div>
            <h3>{t('home.feature2.title')}</h3>
            <p style={{ maxWidth: '400px' }}>{t('home.feature2.desc')} {t('home.feature3.desc')}</p>
          </ScrollReveal>
        </div>

        {/* CTA */}
        <section className="card cta-section" style={{ textAlign: 'center', padding: '4rem 2rem', marginBottom: '3rem', borderRadius: '32px', border: '1px solid var(--line-accent)', background: 'linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.8) 100%)' }}>
          <ScrollReveal>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
              <span className="gradient-text">{t('home.cta.title')}</span>{t('home.cta.suffix')}
            </h2>
            <p className="subtitle" style={{ maxWidth: '400px', margin: '0 auto 2rem', fontSize: '1.1rem' }}>
              {t('home.cta.subtitle')}
            </p>
            <Link href="/admin" className="button-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem', borderRadius: '16px' }}>
              {t('home.cta.button')}
            </Link>
          </ScrollReveal>
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
