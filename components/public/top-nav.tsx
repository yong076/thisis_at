'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/client';
import { LanguageSwitcher } from './language-switcher';

export function TopNav() {
  const t = useT();

  return (
    <header className="top-nav">
      <Link href="/" className="brand">
        thisis.at
      </Link>
      <nav className="nav-links" aria-label="Primary">
        <Link href="/demo" className="nav-link">
          {t('nav.demo')}
        </Link>
        <Link href="/explore" className="nav-link">
          {t('nav.explore')}
        </Link>
        <Link href="/admin" className="nav-link nav-link--cta">
          {t('nav.dashboard')}
        </Link>
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
