'use client';

import { useState, useTransition, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { THEMES } from '@/lib/themes';
import { FONT_OPTIONS } from '@/lib/fonts';
import { useT } from '@/lib/i18n/client';
import { LanguageSwitcher } from '@/components/public/language-switcher';
import { BlocksTab } from './blocks/blocks-tab';
import { CodeEditorTab } from './code/code-editor-tab';
import { BlockEditDialog } from './blocks/block-edit-dialog';
import { BlockAddDialog } from './blocks/block-add-dialog';
import { LivePreview } from './preview/live-preview';
import { AvatarUpload } from './profile/avatar-upload';
import type { PublicProfile, ProfileBlock, BlockType } from '@/lib/types';
import type { ThemeConfig } from '@/lib/themes';
import type { FontOption } from '@/lib/fonts';

type Tab = 'blocks' | 'theme' | 'fonts' | 'style' | 'code';
type MobileView = 'edit' | 'preview';

export function EditorContent({ profile }: { profile: PublicProfile }) {
  const t = useT();
  const [activeTab, setActiveTab] = useState<Tab>('blocks');
  const [blocks, setBlocks] = useState<ProfileBlock[]>(
    [...profile.blocks].sort((a, b) => a.order - b.order),
  );
  const [selectedTheme, setSelectedTheme] = useState(profile.customization?.themeId ?? 'radiant');
  const [selectedFontBody, setSelectedFontBody] = useState(profile.customization?.fontBody ?? 'pretendard');
  const [selectedFontDisplay, setSelectedFontDisplay] = useState(profile.customization?.fontDisplay ?? 'fraunces');
  const [buttonStyle, setButtonStyle] = useState<string>(profile.customization?.buttonStyle ?? 'gradient');
  const [cardStyle, setCardStyle] = useState<string>(profile.customization?.cardStyle ?? 'glass');
  const [showSparkles, setShowSparkles] = useState(profile.customization?.showSparkles ?? true);

  // Profile editing state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile.avatarUrl ?? null);

  // Preview-triggered dialogs
  const [editingBlock, setEditingBlock] = useState<ProfileBlock | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [newBlockType, setNewBlockType] = useState<BlockType | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('edit');

  // Derived profile with live avatar edit
  const liveProfile = useMemo(
    () => ({ ...profile, avatarUrl: avatarUrl ?? undefined }),
    [profile, avatarUrl],
  );

  const tabs: { id: Tab; labelKey: string; icon: string }[] = [
    { id: 'blocks', labelKey: 'editor.tab.blocks', icon: '📦' },
    { id: 'theme', labelKey: 'editor.tab.theme', icon: '🎨' },
    { id: 'fonts', labelKey: 'editor.tab.fonts', icon: '✍️' },
    { id: 'style', labelKey: 'editor.tab.style', icon: '💎' },
    { id: 'code', labelKey: 'editor.tab.code', icon: '⌨️' },
  ];

  const handleBlocksChange = useCallback((newBlocks: ProfileBlock[]) => {
    setBlocks(newBlocks);
  }, []);

  // Preview callbacks
  const handlePreviewEdit = useCallback((block: ProfileBlock) => {
    setEditingBlock(block);
  }, []);

  const handlePreviewToggle = useCallback((blockId: string, enabled: boolean) => {
    setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, enabled } : b)));
    fetch(`/api/editor/${encodeURIComponent(profile.handle)}/blocks/${blockId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    }).catch(() => {});
  }, [profile.handle]);

  const handlePreviewDelete = useCallback((blockId: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    fetch(`/api/editor/${encodeURIComponent(profile.handle)}/blocks/${blockId}`, {
      method: 'DELETE',
    }).catch(() => {});
  }, [profile.handle]);

  const handlePreviewInsert = useCallback((index: number) => {
    setInsertIndex(index);
  }, []);

  const handleBlockTypeSelected = useCallback((type: BlockType) => {
    setNewBlockType(type);
    setInsertIndex(null);
  }, []);

  const handleBlockSaved = useCallback(
    (savedBlock: ProfileBlock) => {
      setBlocks((prev) => {
        const exists = prev.some((b) => b.id === savedBlock.id);
        if (exists) {
          return prev.map((b) => (b.id === savedBlock.id ? savedBlock : b));
        }
        return [...prev, savedBlock];
      });
      setEditingBlock(null);
      setNewBlockType(null);
    },
    [],
  );

  return (
    <main className="editor-layout">
      {/* Left Panel: Controls */}
      <div className={`editor-controls ${mobileView === 'preview' ? 'editor-controls--hidden-mobile' : ''}`}>
        <header className="admin-header">
          <Link href="/admin" className="brand">
            thisis.at
          </Link>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <LanguageSwitcher />
            <Link href={`/editor/@${profile.handle}/analytics`} className="button-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              {t('nav.analytics')}
            </Link>
            <Link href={`/@${profile.handle}`} className="button-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              {t('nav.viewProfile')}
            </Link>
          </div>
        </header>

        {/* Profile Card with Avatar Upload */}
        <section className="card dash-card editor-profile-card">
          <div className="editor-profile-row">
            <AvatarUpload
              handle={profile.handle}
              displayName={profile.displayName}
              avatarUrl={avatarUrl}
              onAvatarChange={setAvatarUrl}
            />
            <div className="editor-profile-info">
              <h1 style={{ margin: 0, fontSize: '1.1rem' }}>
                <span className="gradient-text">@{profile.handle}</span>
              </h1>
              <p className="subtitle" style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                {t('editor.subtitle')}
              </p>
            </div>
          </div>
        </section>

        <div className="editor-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`editor-tab ${activeTab === tab.id ? 'editor-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="editor-tab-icon">{tab.icon}</span>
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {activeTab === 'blocks' && (
          <BlocksTab
            blocks={blocks}
            handle={profile.handle}
            profileType={profile.type}
            onBlocksChange={handleBlocksChange}
          />
        )}
        {activeTab === 'theme' && (
          <ThemeTab
            selectedTheme={selectedTheme}
            onSelect={setSelectedTheme}
            handle={profile.handle}
          />
        )}
        {activeTab === 'fonts' && (
          <FontsTab
            selectedBody={selectedFontBody}
            selectedDisplay={selectedFontDisplay}
            onSelectBody={setSelectedFontBody}
            onSelectDisplay={setSelectedFontDisplay}
            handle={profile.handle}
          />
        )}
        {activeTab === 'style' && (
          <StyleTab
            buttonStyle={buttonStyle}
            cardStyle={cardStyle}
            showSparkles={showSparkles}
            onButtonStyle={setButtonStyle}
            onCardStyle={setCardStyle}
            onShowSparkles={setShowSparkles}
            handle={profile.handle}
          />
        )}
        {activeTab === 'code' && (
          <CodeEditorTab
            blocks={blocks}
            handle={profile.handle}
            onBlocksChange={handleBlocksChange}
          />
        )}
      </div>

      {/* Right Panel: Live Preview */}
      <div className={`editor-preview-pane ${mobileView === 'edit' ? 'editor-preview-pane--hidden-mobile' : 'editor-preview-pane--show-mobile'}`}>
        <LivePreview
          profile={liveProfile}
          blocks={blocks}
          themeId={selectedTheme}
          fontBodyId={selectedFontBody}
          fontDisplayId={selectedFontDisplay}
          buttonStyle={buttonStyle}
          cardStyle={cardStyle}
          showSparkles={showSparkles}
          onEditBlock={handlePreviewEdit}
          onToggleBlock={handlePreviewToggle}
          onDeleteBlock={handlePreviewDelete}
          onInsertBlock={handlePreviewInsert}
        />
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="mobile-bottom-bar">
        <button
          type="button"
          className={`mobile-bottom-tab ${mobileView === 'edit' ? 'mobile-bottom-tab--active' : ''}`}
          onClick={() => setMobileView('edit')}
        >
          <span>✏️</span>
          {t('editor.tab.edit') || '편집'}
        </button>
        <button
          type="button"
          className={`mobile-bottom-tab ${mobileView === 'preview' ? 'mobile-bottom-tab--active' : ''}`}
          onClick={() => setMobileView('preview')}
        >
          <span>👁️</span>
          {t('editor.preview') || '미리보기'}
        </button>
      </div>

      {/* Edit Block Dialog (from preview click) */}
      <BlockEditDialog
        open={!!editingBlock}
        block={editingBlock}
        handle={profile.handle}
        onClose={() => setEditingBlock(null)}
        onSaved={handleBlockSaved}
      />

      {/* Insert Block Type Selector (from preview + button) */}
      <BlockAddDialog
        open={insertIndex !== null}
        profileType={profile.type}
        onClose={() => setInsertIndex(null)}
        onSelect={handleBlockTypeSelected}
      />

      {/* New Block Form (after type selection from preview) */}
      <BlockEditDialog
        open={!!newBlockType}
        block={null}
        newBlockType={newBlockType ?? undefined}
        handle={profile.handle}
        onClose={() => setNewBlockType(null)}
        onSaved={handleBlockSaved}
      />
    </main>
  );
}

/* ─── Theme Tab ──────────────────────────────────────────────────── */

function ThemeTab({
  selectedTheme,
  onSelect,
  handle,
}: {
  selectedTheme: string;
  onSelect: (id: string) => void;
  handle: string;
}) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const categories = ['vibrant', 'light', 'dark', 'minimal'] as const;

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/customization`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeId: selectedTheme }),
        });
        if (res.ok) {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch {
        // silently ignore
      }
    });
  }

  return (
    <section style={{ marginTop: '1rem' }}>
      <div className="editor-save-bar">
        <button className="button-primary" onClick={handleSave} disabled={isPending} type="button">
          {isPending ? t('common.saving') : saved ? t('common.saved') : t('editor.saveTheme')}
        </button>
      </div>

      {categories.map((cat) => {
        const themes = THEMES.filter((th) => th.category === cat);
        return (
          <div key={cat} style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              {t(`theme.category.${cat}`)} ({themes.length})
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
  handle,
}: {
  selectedBody: string;
  selectedDisplay: string;
  onSelectBody: (id: string) => void;
  onSelectDisplay: (id: string) => void;
  handle: string;
}) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/customization`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fontBody: selectedBody, fontDisplay: selectedDisplay }),
        });
        if (res.ok) {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch {
        // silently ignore
      }
    });
  }

  return (
    <section style={{ marginTop: '1rem' }}>
      <div className="editor-save-bar">
        <button className="button-primary" onClick={handleSave} disabled={isPending} type="button">
          {isPending ? t('common.saving') : saved ? t('common.saved') : t('editor.saveFonts')}
        </button>
      </div>

      <div className="card dash-card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>{t('fonts.bodyTitle')}</h3>
        <p className="subtitle" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
          {t('fonts.bodyDesc')}
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

      <div className="card dash-card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>{t('fonts.displayTitle')}</h3>
        <p className="subtitle" style={{ marginBottom: '1rem', fontSize: '0.85rem' }}>
          {t('fonts.displayDesc')}
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

function StyleTab({
  buttonStyle,
  cardStyle,
  showSparkles,
  onButtonStyle,
  onCardStyle,
  onShowSparkles,
  handle,
}: {
  buttonStyle: string;
  cardStyle: string;
  showSparkles: boolean;
  onButtonStyle: (s: string) => void;
  onCardStyle: (s: string) => void;
  onShowSparkles: (b: boolean) => void;
  handle: string;
}) {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/customization`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ buttonStyle, cardStyle, showSparkles }),
        });
        if (res.ok) {
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        }
      } catch {
        // silently ignore
      }
    });
  }

  const buttonStyles = [
    { id: 'gradient', labelKey: 'style.btn.gradient' },
    { id: 'solid', labelKey: 'style.btn.solid' },
    { id: 'outline', labelKey: 'style.btn.outline' },
    { id: 'glass', labelKey: 'style.btn.glass' },
  ];

  const cardStyles = [
    { id: 'glass', labelKey: 'style.card.glass' },
    { id: 'solid', labelKey: 'style.card.solid' },
    { id: 'border-only', labelKey: 'style.card.borderOnly' },
    { id: 'shadow', labelKey: 'style.card.shadow' },
  ];

  return (
    <section style={{ marginTop: '1rem' }}>
      <div className="editor-save-bar">
        <button className="button-primary" onClick={handleSave} disabled={isPending} type="button">
          {isPending ? t('common.saving') : saved ? t('common.saved') : t('editor.saveStyle')}
        </button>
      </div>

      <div className="card dash-card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>{t('style.buttonTitle')}</h3>
        <div className="style-options">
          {buttonStyles.map((s) => (
            <button
              key={s.id}
              className={`style-option ${buttonStyle === s.id ? 'style-option--active' : ''}`}
              onClick={() => onButtonStyle(s.id)}
              type="button"
            >
              <div className={`style-preview style-preview--btn-${s.id}`}>
                {t('style.preview.button')}
              </div>
              <span>{t(s.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card dash-card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>{t('style.cardTitle')}</h3>
        <div className="style-options">
          {cardStyles.map((s) => (
            <button
              key={s.id}
              className={`style-option ${cardStyle === s.id ? 'style-option--active' : ''}`}
              onClick={() => onCardStyle(s.id)}
              type="button"
            >
              <div className={`style-preview style-preview--card-${s.id}`}>
                {t('style.preview.card')}
              </div>
              <span>{t(s.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="card dash-card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.75rem' }}>{t('style.extraTitle')}</h3>
        <div className="style-toggles">
          <label className="style-toggle">
            <input
              type="checkbox"
              checked={showSparkles}
              onChange={(e) => onShowSparkles(e.target.checked)}
            />
            <span>{t('style.sparkles')}</span>
          </label>
        </div>
      </div>
    </section>
  );
}
