'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useT } from '@/lib/i18n/client';
import { LanguageSwitcher } from '@/components/public/language-switcher';
import type { PublicProfile, ProfileCategory } from '@/lib/types';

type CategoryWithId = ProfileCategory & { id: string };

type Props = {
  categories: CategoryWithId[];
  profiles: PublicProfile[];
};

export function ExploreView({ categories, profiles }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const t = useT();

  const filtered =
    activeCategory === 'all'
      ? profiles
      : profiles.filter((p) => p.category?.slug === activeCategory);

  function badgeLabel(type: string) {
    return t(`profileType.${type}`);
  }

  return (
    <main className="page explore-page">
      {/* Header */}
      <div className="explore-header">
        <Link href="/" className="brand">thisis.at</Link>
        <h1 className="explore-title">
          <span className="gradient-text">at</span> {t('explore.title')}
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LanguageSwitcher />
          <Link href="/dashboard" className="button-primary" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            {t('explore.createAt')}
          </Link>
        </div>
      </div>

      {/* Category filter */}
      <div className="explore-filters">
        <button
          className={`explore-cat-pill ${activeCategory === 'all' ? 'explore-cat-pill--active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          {t('explore.all')}
          <span className="explore-cat-count">{profiles.length}</span>
        </button>
        {categories.map((cat) => {
          const count = profiles.filter((p) => p.category?.slug === cat.slug).length;
          return (
            <button
              key={cat.id}
              className={`explore-cat-pill ${activeCategory === cat.slug ? 'explore-cat-pill--active' : ''}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.icon && <span>{cat.icon}</span>}
              {cat.nameKo}
              {count > 0 && <span className="explore-cat-count">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Profile grid */}
      <div className="explore-grid">
        {filtered.length === 0 ? (
          <div className="explore-empty">
            <p>{t('explore.empty')}</p>
          </div>
        ) : (
          filtered.map((profile) => (
            <Link
              key={profile.id}
              href={`/@${profile.handle}`}
              className="explore-card card"
            >
              {/* Cover or gradient */}
              <div className="explore-card-cover">
                {profile.coverUrl ? (
                  <Image src={profile.coverUrl} alt="" fill sizes="320px" />
                ) : (
                  <div className="explore-card-cover-gradient" />
                )}
              </div>

              {/* Info */}
              <div className="explore-card-info">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt=""
                    width={48}
                    height={48}
                    className="explore-card-avatar"
                  />
                ) : (
                  <div className="explore-card-avatar explore-card-avatar--placeholder">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="explore-card-name">{profile.displayName}</h3>
                <p className="explore-card-handle">@{profile.handle}</p>
                <div className="explore-card-meta">
                  <span className="explore-card-type">{badgeLabel(profile.type)}</span>
                  {profile.category && (
                    <span className="explore-card-category">
                      {profile.category.icon} {profile.category.nameKo}
                    </span>
                  )}
                </div>
                {profile.bio && (
                  <p className="explore-card-bio">{profile.bio}</p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
