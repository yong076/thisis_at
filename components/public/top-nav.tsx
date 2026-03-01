'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useT } from '@/lib/i18n/client';
import { LanguageSwitcher } from './language-switcher';

export function TopNav() {
  const t = useT();
  const { data: session } = useSession();

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
        <Link href="/dashboard" className="nav-link nav-link--cta">
          {t('nav.dashboard')}
        </Link>
        {session?.user?.role === 'ADMIN' && (
          <Link href="/admin" className="nav-link nav-link--admin">
            Admin
          </Link>
        )}
        <LanguageSwitcher />
      </nav>
    </header>
  );
}
