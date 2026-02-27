'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DefaultShell } from '@/components/public/default-shell';
import { getProfileByHandle } from '@/lib/mock-data';
import { THEMES } from '@/lib/themes';
import { FONT_OPTIONS } from '@/lib/fonts';
import { normalizeHandle } from '@/lib/handle';
import type { PublicProfile, ProfileBlock } from '@/lib/types';
import type { ThemeConfig } from '@/lib/themes';
import type { FontOption } from '@/lib/fonts';

type Tab = 'blocks' | 'theme' | 'fonts' | 'style';

export default function EditorPage({ params }: { params: { handle: string } }) {
  const normalized = normalizeHandle(params.handle);
  const profile = getProfileByHandle(normalized);

  if (!profile) {
    notFound();
  }

  return (
    <DefaultShell>
      <EditorContent profile={profile} />
    </DefaultShell>
  );
}

function EditorContent({ profile }: { profile: PublicProfile }) {
  const [activeTab, setActiveTab] = useState<Tab>('blocks');
  const [selectedTheme, setSelectedTheme] = useState(profile.customization?.themeId ?? 'radiant');
  const [selectedFontBody, setSelectedFontBody] = useState(profile.customization?.fontBody ?? 'pretendard');
  const [selectedFontDisplay, setSelectedFontDisplay] = useState(profile.customization?.fontDisplay ?? 'fraunces');

  const blocks = profile.blocks.sort((a, b) => a.order - b.order);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'blocks', label: '블록' },
    { id: 'theme', label: '테마' },
    { id: 'fonts', label: '폰트' },
    { id: 'style', label: '스타일' },
  ];

  return (
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
        <p className="subtitle">블록, 테마, 폰트, 스타일을 관리하세요.</p>
      </section>

      {/* Tab Navigation */}
      <div className="editor-tabs animate-fade-up">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`editor-tab ${activeTab === tab.id ? 'editor-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'blocks' && <BlocksTab blocks={blocks} />}
      {activeTab === 'theme' && <ThemeTab selectedTheme={selectedTheme} onSelect={setSelectedTheme} />}
      {activeTab === 'fonts' && (
        <FontsTab
          selectedBody={selectedFontBody}
          selectedDisplay={selectedFontDisplay}
          onSelectBody={setSelectedFontBody}
          onSelectDisplay={setSelectedFontDisplay}
        />
      )}
      {activeTab === 'style' && <StyleTab />}
    </main>
  );
}

/* ─── Blocks Tab ─────────────────────────────────────────────────── */

function BlocksTab({ blocks }: { blocks: ProfileBlock[] }) {
  return (
    <section className="simple-grid" style={{ marginTop: '1rem' }}>
      {blocks.map((block, idx) => (
        <article
          key={block.id}
          className={`card editor-block animate-fade-up animate-delay-${Math.min(idx + 1, 4)}`}
        >
          <div className="editor-block-header">
            <span className="editor-block-type">{block.type.replace(/_/g, ' ')}</span>
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
          <pre
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
  );
}

/* ─── Theme Tab ──────────────────────────────────────────────────── */

function ThemeTab({ selectedTheme, onSelect }: { selectedTheme: string; onSelect: (id: string) => void }) {
  const categories = ['vibrant', 'light', 'dark', 'minimal'] as const;
  const categoryNames: Record<string, string> = {
    vibrant: '비비드',
    light: '라이트',
    dark: '다크',
    minimal: '미니멀',
  };

  return (
    <section style={{ marginTop: '1rem' }}>
      {categories.map((cat) => {
        const themes = THEMES.filter((t) => t.category === cat);
        return (
          <div key={cat} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              {categoryNames[cat]} ({themes.length})
            </h3>
            <div className="theme-grid">
              {themes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  selected={selectedTheme === theme.id}
                  onSelect={() => onSelect(theme.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}

function ThemeCard({ theme, selected, onSelect }: { theme: ThemeConfig; selected: boolean; onSelect: () => void }) {
  return (
    <button
      className={`theme-card ${selected ? 'theme-card--selected' : ''}`}
      onClick={onSelect}
      type="button"
    >
      <div className="theme-card-preview" style={{ background: theme.preview }} />
      <div className="theme-card-info">
        <span className="theme-card-name">{theme.nameKo}</span>
        <span className="theme-card-id">{theme.name}</span>
      </div>
      {selected && <div className="theme-card-check">✓</div>}
    </button>
  );
}

/* ─── Fonts Tab ──────────────────────────────────────────────────── */

function FontsTab({
  selectedBody,
  selectedDisplay,
  onSelectBody,
  onSelectDisplay,
}: {
  selectedBody: string;
  selectedDisplay: string;
  onSelectBody: (id: string) => void;
  onSelectDisplay: (id: string) => void;
}) {
  return (
    <section style={{ marginTop: '1rem' }}>
      <div className="card dash-card animate-fade-up" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>본문 폰트</h3>
        <p className="subtitle" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
          프로필 페이지의 본문, 설명 텍스트에 사용됩니다.
        </p>
        <div className="font-grid">
          {FONT_OPTIONS.map((font) => (
            <FontCard
              key={font.id}
              font={font}
              selected={selectedBody === font.id}
              onSelect={() => onSelectBody(font.id)}
            />
          ))}
        </div>
      </div>

      <div className="card dash-card animate-fade-up animate-delay-1" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>제목 폰트</h3>
        <p className="subtitle" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
          프로필 이름, 블록 제목 등에 사용됩니다.
        </p>
        <div className="font-grid">
          {FONT_OPTIONS.map((font) => (
            <FontCard
              key={font.id}
              font={font}
              selected={selectedDisplay === font.id}
              onSelect={() => onSelectDisplay(font.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FontCard({ font, selected, onSelect }: { font: FontOption; selected: boolean; onSelect: () => void }) {
  return (
    <button
      className={`font-card ${selected ? 'font-card--selected' : ''}`}
      onClick={onSelect}
      type="button"
    >
      <span className="font-card-name">{font.nameKo}</span>
      <span className="font-card-preview">{font.previewTextKo}</span>
      <span className="font-card-category">{font.category}</span>
      {selected && <span className="font-card-check">✓</span>}
    </button>
  );
}

/* ─── Style Tab ──────────────────────────────────────────────────── */

function StyleTab() {
  return (
    <section style={{ marginTop: '1rem' }}>
      <div className="card dash-card animate-fade-up" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>버튼 스타일</h3>
        <div className="style-options">
          {(['gradient', 'solid', 'outline', 'glass'] as const).map((style) => (
            <button key={style} className="style-option" type="button">
              <div className={`style-preview style-preview--btn-${style}`}>
                버튼
              </div>
              <span>{style === 'gradient' ? '그라디언트' : style === 'solid' ? '솔리드' : style === 'outline' ? '아웃라인' : '글래스'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card dash-card animate-fade-up animate-delay-1" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>카드 스타일</h3>
        <div className="style-options">
          {(['glass', 'solid', 'border-only', 'shadow'] as const).map((style) => (
            <button key={style} className="style-option" type="button">
              <div className={`style-preview style-preview--card-${style}`}>
                카드
              </div>
              <span>{style === 'glass' ? '글래스' : style === 'solid' ? '솔리드' : style === 'border-only' ? '보더' : '그림자'}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card dash-card animate-fade-up animate-delay-2" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>추가 옵션</h3>
        <div className="style-toggles">
          <label className="style-toggle">
            <input type="checkbox" defaultChecked />
            <span>스파클 효과</span>
          </label>
          <label className="style-toggle">
            <input type="checkbox" defaultChecked />
            <span>메쉬 배경</span>
          </label>
        </div>
      </div>
    </section>
  );
}
