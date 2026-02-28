'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getThemeById, themeToCssVars } from '@/lib/themes';
import type { PublicProfile } from '@/lib/types';

type ThemeMeta = {
  id: string;
  name: string;
  nameKo: string;
  category: string;
  preview: string;
};

type Props = {
  profiles: PublicProfile[];
  themes: ThemeMeta[];
};

const CATEGORIES = [
  { id: 'all', label: '전체', count: 0 },
  { id: 'vibrant', label: '비비드' },
  { id: 'dark', label: '다크' },
  { id: 'light', label: '라이트' },
  { id: 'minimal', label: '미니멀' },
];

export function DemoView({ profiles, themes }: Props) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeProfileIdx, setActiveProfileIdx] = useState(0);
  const [expandedThemeId, setExpandedThemeId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const profile = profiles[activeProfileIdx];
  const filtered =
    activeCategory === 'all'
      ? themes
      : themes.filter((t) => t.category === activeCategory);

  // Open/close full-preview dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (expandedThemeId && !dialog.open) {
      dialog.showModal();
    } else if (!expandedThemeId && dialog.open) {
      dialog.close();
    }
  }, [expandedThemeId]);

  if (!profile) return null;

  return (
    <div className="demo-page">
      {/* ─── Header ───────────────────────────────────────────── */}
      <header className="demo-header">
        <div className="demo-header-inner">
          <Link href="/" className="brand">thisis.at</Link>
          <div className="demo-header-center">
            <h1 className="demo-heading">
              <span className="gradient-text">30가지 테마</span>를 직접 확인하세요
            </h1>
          </div>
          <Link href="/admin" className="button-primary demo-start-btn">시작하기</Link>
        </div>
      </header>

      {/* ─── Toolbar ──────────────────────────────────────────── */}
      <div className="demo-toolbar">
        <div className="demo-toolbar-inner">
          {/* Profile toggle */}
          {profiles.length > 1 && (
            <div className="demo-profile-toggle">
              {profiles.map((p, idx) => (
                <button
                  key={p.id}
                  className={`demo-profile-pill ${idx === activeProfileIdx ? 'demo-profile-pill--active' : ''}`}
                  onClick={() => setActiveProfileIdx(idx)}
                >
                  {p.avatarUrl && (
                    <Image src={p.avatarUrl} alt="" width={22} height={22} className="demo-pill-avatar" />
                  )}
                  <span>{p.displayName}</span>
                </button>
              ))}
            </div>
          )}

          {/* Category pills */}
          <div className="demo-cat-pills">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`demo-cat-pill ${activeCategory === cat.id ? 'demo-cat-pill--active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
                {cat.id === 'all' && <span className="demo-cat-count">{themes.length}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Theme Grid ───────────────────────────────────────── */}
      <main className="demo-grid-wrap">
        <div className="demo-grid">
          {filtered.map((t) => (
            <ThemePreviewCard
              key={t.id}
              theme={t}
              profile={profile}
              onClick={() => setExpandedThemeId(t.id)}
            />
          ))}
        </div>
      </main>

      {/* ─── Full Preview Dialog ──────────────────────────────── */}
      <dialog
        ref={dialogRef}
        className="demo-fullpreview-dialog"
        onClick={(e) => {
          const rect = dialogRef.current?.getBoundingClientRect();
          if (!rect) return;
          if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
            setExpandedThemeId(null);
          }
        }}
        onClose={() => setExpandedThemeId(null)}
      >
        {expandedThemeId && (
          <FullThemePreview
            themeId={expandedThemeId}
            profile={profile}
            themes={filtered}
            onChangeTheme={setExpandedThemeId}
            onClose={() => setExpandedThemeId(null)}
          />
        )}
      </dialog>

      {/* ─── Footer CTA ───────────────────────────────────────── */}
      <footer className="demo-footer">
        <p className="demo-footer-text">마음에 드는 테마를 찾으셨나요?</p>
        <Link href="/admin" className="button-primary">나만의 페이지 만들기</Link>
      </footer>
    </div>
  );
}

/* ─── Mini Preview Card ───────────────────────────────────────── */

function ThemePreviewCard({
  theme,
  profile,
  onClick,
}: {
  theme: ThemeMeta;
  profile: PublicProfile;
  onClick: () => void;
}) {
  const fullTheme = getThemeById(theme.id);
  const cssVars = themeToCssVars(fullTheme);

  return (
    <button className="demo-card" onClick={onClick}>
      {/* Mini profile preview with theme applied */}
      <div className="demo-card-preview" style={cssVars}>
        {/* Cover or gradient */}
        <div className="demo-card-cover" style={{ background: theme.preview }} />

        {/* Mini avatar + info */}
        <div className="demo-card-info">
          {profile.avatarUrl && (
            <Image
              src={profile.avatarUrl}
              alt=""
              width={36}
              height={36}
              className="demo-card-avatar"
            />
          )}
          <div className="demo-card-name" style={{ color: fullTheme.textPrimary }}>
            {profile.displayName}
          </div>
          <div className="demo-card-handle" style={{ color: fullTheme.textSecondary }}>
            @{profile.handle}
          </div>

          {/* Fake block bars */}
          <div className="demo-card-blocks">
            <div className="demo-card-bar" style={{ background: fullTheme.gradientButton, width: '100%' }} />
            <div className="demo-card-bar" style={{ background: fullTheme.cardBgStrong, width: '80%', borderColor: fullTheme.cardBorder }} />
            <div className="demo-card-bar" style={{ background: fullTheme.cardBgStrong, width: '60%', borderColor: fullTheme.cardBorder }} />
          </div>
        </div>
      </div>

      {/* Theme label */}
      <div className="demo-card-footer">
        <span className="demo-card-swatch" style={{ background: theme.preview }} />
        <span className="demo-card-theme-name">{theme.nameKo}</span>
        <span className="demo-card-category">{theme.category}</span>
      </div>
    </button>
  );
}

/* ─── Full Theme Preview (Dialog content) ─────────────────────── */

function FullThemePreview({
  themeId,
  profile,
  themes,
  onChangeTheme,
  onClose,
}: {
  themeId: string;
  profile: PublicProfile;
  themes: ThemeMeta[];
  onChangeTheme: (id: string) => void;
  onClose: () => void;
}) {
  const theme = getThemeById(themeId);
  const cssVars = themeToCssVars(theme);
  const themeMeta = themes.find((t) => t.id === themeId);

  const currentIdx = themes.findIndex((t) => t.id === themeId);
  const prevTheme = currentIdx > 0 ? themes[currentIdx - 1] : null;
  const nextTheme = currentIdx < themes.length - 1 ? themes[currentIdx + 1] : null;

  const blocks = profile.blocks.sort((a, b) => a.order - b.order);

  return (
    <div className="demo-full">
      {/* Top bar */}
      <div className="demo-full-topbar">
        <button className="demo-full-close" onClick={onClose}>✕</button>
        <div className="demo-full-theme-info">
          <span className="demo-full-swatch" style={{ background: themeMeta?.preview }} />
          <strong>{themeMeta?.nameKo}</strong>
          <span className="demo-full-cat">{themeMeta?.category}</span>
        </div>
        <div className="demo-full-nav">
          <button
            className="demo-full-nav-btn"
            disabled={!prevTheme}
            onClick={() => prevTheme && onChangeTheme(prevTheme.id)}
          >
            ← 이전
          </button>
          <button
            className="demo-full-nav-btn"
            disabled={!nextTheme}
            onClick={() => nextTheme && onChangeTheme(nextTheme.id)}
          >
            다음 →
          </button>
        </div>
      </div>

      {/* Full profile preview */}
      <div className="demo-full-body shell" style={{ ...cssVars }}>
        <main className="page page--narrow">
          {/* Profile header */}
          <section className="card profile-card">
            {profile.coverUrl && (
              <div className="profile-cover-wrap">
                <Image src={profile.coverUrl} alt="" fill sizes="520px" priority />
              </div>
            )}
            <div className={`profile-info ${profile.coverUrl ? '' : 'profile-info--no-cover'}`}>
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="" className="avatar" width={88} height={88} />
              ) : (
                <div className="avatar avatar--placeholder">{profile.displayName.charAt(0)}</div>
              )}
              <h1>{profile.displayName}</h1>
              <div className="profile-meta">
                <span className="profile-handle">@{profile.handle}</span>
              </div>
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
            </div>
          </section>

          {/* Blocks */}
          <section className="block-list">
            {blocks.map((block) => {
              if (!block.enabled) return null;
              switch (block.type) {
                case 'TEXT_ANNOUNCEMENT':
                  return (
                    <article key={block.id} className="block-notice">
                      <h3>{block.title ?? '공지'}</h3>
                      <p className="notice-text">{(block.config.text as string) ?? ''}</p>
                    </article>
                  );
                case 'LINK_BUTTON':
                  return (
                    <article key={block.id}>
                      <div className="button-link"><span>{(block.config.label as string) ?? '링크'}</span></div>
                    </article>
                  );
                case 'SOCIAL_ROW': {
                  const links = (block.config.links as { label: string }[]) ?? [];
                  return (
                    <article key={block.id} className="block" style={{ textAlign: 'center' }}>
                      <h3>{block.title ?? '팔로우'}</h3>
                      <div className="social-row">
                        {links.map((l, i) => <span key={i} className="social-chip">{l.label}</span>)}
                      </div>
                    </article>
                  );
                }
                case 'MEDIA_GALLERY': {
                  const images = (block.config.images as string[]) ?? [];
                  const mod = images.length === 1 ? 'gallery--single' : images.length === 3 ? 'gallery--three' : '';
                  return (
                    <article key={block.id} className="block">
                      <h3>{block.title ?? '갤러리'}</h3>
                      <div className={`gallery ${mod}`}>
                        {images.map((img, i) => (
                          <div key={i} className="gallery-item">
                            <Image src={img} alt="" fill sizes="240px" />
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                }
                case 'EVENTS':
                  return (
                    <article key={block.id} className="block">
                      <h3>{block.title ?? '공연'}</h3>
                      <div className="event-list">
                        {profile.events.map((ev) => (
                          <div key={ev.id} className="event-item">
                            <div><strong>{ev.title}</strong><br /><small>{ev.venueName}</small></div>
                          </div>
                        ))}
                      </div>
                    </article>
                  );
                case 'PLACE_INFO':
                  return (
                    <article key={block.id} className="block">
                      <h3>{block.title ?? '위치'}</h3>
                      <p style={{ margin: '0 0 0.3rem', fontSize: '0.92rem' }}>{(block.config.address as string) ?? ''}</p>
                      <div className="button-link"><span>지도 열기</span></div>
                    </article>
                  );
                default:
                  return null;
              }
            })}
          </section>
        </main>
      </div>
    </div>
  );
}
