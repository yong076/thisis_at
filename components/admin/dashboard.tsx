'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';
import { useT } from '@/lib/i18n/client';
import { LanguageSwitcher } from '@/components/public/language-switcher';
import type { PublicProfile } from '@/lib/types';
import { CreateProfileDialog } from './create-profile-dialog';

export function Dashboard({
  profiles,
  userName,
}: {
  profiles: PublicProfile[];
  userName: string;
}) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const t = useT();

  return (
    <main className="page">
      {/* Header */}
      <div className="admin-header">
        <Link href="/" className="brand">
          thisis.at
        </Link>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <LanguageSwitcher />
          <button className="btn-logout" onClick={() => signOut({ callbackUrl: '/login' })}>
            {t('nav.logout')}
          </button>
        </div>
      </div>

      {/* Welcome */}
      <section className="card admin-welcome animate-fade-up">
        <h1>
          {(() => {
            const full = t('admin.welcome', { name: '__NAME__' });
            const parts = full.split('__NAME__');
            return <>{parts[0]}<span className="gradient-text">{userName}</span>{parts[1]}</>;
          })()}
        </h1>
        <p className="subtitle">{t('admin.subtitle')}</p>
      </section>

      {/* Stats */}
      <div className="admin-stats animate-fade-up animate-delay-1">
        <div className="card stat-card">
          <div className="stat-value">{profiles.length}</div>
          <div className="stat-label">{t('admin.stat.profiles')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{profiles.reduce((sum, p) => sum + p.blocks.length, 0)}</div>
          <div className="stat-label">{t('admin.stat.blocks')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{profiles.reduce((sum, p) => sum + p.events.length, 0)}</div>
          <div className="stat-label">{t('admin.stat.events')}</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{profiles.filter((p) => p.type === 'ARTIST').length}</div>
          <div className="stat-label">{t('admin.stat.artists')}</div>
        </div>
      </div>

      {/* Profiles Section */}
      <div className="profiles-section-header animate-fade-up animate-delay-2">
        <h2>{t('admin.profileList')}</h2>
        <button
          className="button-primary btn-create-profile"
          onClick={() => setShowCreateDialog(true)}
        >
          <span className="btn-icon">+</span>
          {t('admin.createProfile')}
        </button>
      </div>

      <div className="simple-grid">
        {profiles.length === 0 ? (
          <div className="card empty-state animate-fade-up animate-delay-3">
            <div className="empty-icon">🎤</div>
            <h3>{t('admin.emptyState')}</h3>
            <p className="subtitle">{t('admin.emptySubtitle')}</p>
            <button
              className="button-primary"
              onClick={() => setShowCreateDialog(true)}
              style={{ marginTop: '1rem' }}
            >
              {t('admin.start')}
            </button>
          </div>
        ) : (
          profiles.map((profile, idx) => (
            <ProfileCard key={profile.id} profile={profile} delay={idx} />
          ))
        )}
      </div>

      {/* Create Profile Dialog */}
      <CreateProfileDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
      />
    </main>
  );
}

/* ─── Profile Card ─────────────────────────────────────────────── */

function badgeClass(type: string) {
  switch (type) {
    case 'ARTIST': return 'badge badge--artist';
    case 'VENUE': return 'badge badge--venue';
    case 'BUSINESS': return 'badge badge--business';
    case 'INFLUENCER': return 'badge badge--influencer';
    case 'PERSONAL': return 'badge badge--personal';
    case 'RESTAURANT': return 'badge badge--restaurant';
    case 'ORGANIZATION': return 'badge badge--organization';
    default: return 'badge badge--creator';
  }
}

function ProfileCard({ profile, delay }: { profile: PublicProfile; delay: number }) {
  const t = useT();

  return (
    <article
      className={`card dash-profile-card animate-fade-up animate-delay-${Math.min(delay + 1, 4)}`}
    >
      {profile.avatarUrl ? (
        <Image
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="dash-profile-avatar"
          width={56}
          height={56}
        />
      ) : (
        <div className="dash-profile-avatar dash-profile-avatar--placeholder">
          {profile.displayName.charAt(0).toUpperCase()}
        </div>
      )}

      <div className="dash-profile-info">
        <strong>{profile.displayName}</strong>
        <p className="subtitle" style={{ fontSize: '0.85rem' }}>
          @{profile.handle} &middot;{' '}
          <span className={badgeClass(profile.type)}>{t(`profileType.${profile.type}`)}</span>
        </p>
      </div>

      <div className="dash-profile-actions">
        <Link
          href={`/editor/@${profile.handle}/analytics`}
          className="button-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
        >
          {t('nav.analytics')}
        </Link>
        <Link
          href={`/@${profile.handle}`}
          className="button-secondary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
        >
          {t('block.view')}
        </Link>
        <Link
          href={`/editor/@${profile.handle}`}
          className="button-primary"
          style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
        >
          {t('common.edit')}
        </Link>
      </div>
    </article>
  );
}
