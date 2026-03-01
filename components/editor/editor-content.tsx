'use client';

import { useState, useTransition, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { THEMES } from '@/lib/themes';
import { FONT_OPTIONS } from '@/lib/fonts';
import { useT } from '@/lib/i18n/client';
import { useToast } from '@/components/ui/toast';
import { LanguageSwitcher } from '@/components/public/language-switcher';
import { BlocksTab } from './blocks/blocks-tab';
import { CodeEditorTab } from './code/code-editor-tab';
import { BlockEditDialog } from './blocks/block-edit-dialog';
import { BlockAddDialog } from './blocks/block-add-dialog';
import { LivePreview } from './preview/live-preview';
import { AvatarUpload } from './profile/avatar-upload';
import { CharCountInput } from './shared/char-count-input';
import { ImageUpload } from './shared/image-upload';
import { useUnsavedChanges } from './hooks/use-unsaved-changes';
import type { PublicProfile, ProfileBlock, BlockType } from '@/lib/types';
import type { ThemeConfig } from '@/lib/themes';
import type { FontOption } from '@/lib/fonts';

type EditorPage = 'links' | 'appearance';
type MobileView = 'edit' | 'preview';

export function EditorContent({ profile }: { profile: PublicProfile }) {
  const t = useT();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState<EditorPage>('links');
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
  const [coverUrl, setCoverUrl] = useState<string | null>(profile.coverUrl ?? null);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [bio, setBio] = useState(profile.bio ?? '');
  const [location, setLocation] = useState(profile.location ?? '');
  const [profileSaving, startProfileSave] = useTransition();

  // Unsaved changes detection for profile fields
  const currentProfileSnapshot = `${displayName}|${bio}|${location}`;
  const originalProfileSnapshot = `${profile.displayName}|${profile.bio ?? ''}|${profile.location ?? ''}`;
  const { hasChanges: hasProfileChanges, markSaved: markProfileSaved } = useUnsavedChanges(currentProfileSnapshot, originalProfileSnapshot);

  // Code editor toggle
  const [showCodeEditor, setShowCodeEditor] = useState(false);

  // Preview-triggered dialogs
  const [editingBlock, setEditingBlock] = useState<ProfileBlock | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [newBlockType, setNewBlockType] = useState<BlockType | null>(null);
  const [mobileView, setMobileView] = useState<MobileView>('edit');

  // Derived profile with live edits
  const liveProfile = useMemo(
    () => ({ ...profile, avatarUrl: avatarUrl ?? undefined, coverUrl: coverUrl ?? undefined, displayName, bio, location }),
    [profile, avatarUrl, coverUrl, displayName, bio, location],
  );

  const handleProfileSave = useCallback(() => {
    startProfileSave(async () => {
      try {
        const res = await fetch(`/api/editor/${encodeURIComponent(profile.handle)}/profile`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ displayName, bio, location }),
        });
        if (res.ok) {
          toast('프로필이 저장되었습니다.', 'success');
          markProfileSaved();
        } else {
          toast('프로필 저장에 실패했습니다.', 'error');
        }
      } catch {
        toast('네트워크 오류가 발생했습니다.', 'error');
      }
    });
  }, [profile.handle, displayName, bio, location, toast, markProfileSaved]);

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
    }).catch(() => {
      // Rollback on error
      setBlocks((prev) => prev.map((b) => (b.id === blockId ? { ...b, enabled: !enabled } : b)));
      toast('블록 상태 변경에 실패했습니다.', 'error');
    });
  }, [profile.handle, toast]);

  const handlePreviewDelete = useCallback((blockId: string) => {
    const previous = blocks;
    setBlocks((prev) => prev.filter((b) => b.id !== blockId));
    fetch(`/api/editor/${encodeURIComponent(profile.handle)}/blocks/${blockId}`, {
      method: 'DELETE',
    }).then((res) => {
      if (res.ok) {
        toast('블록이 삭제되었습니다.', 'success');
      } else {
        setBlocks(previous);
        toast('블록 삭제에 실패했습니다.', 'error');
      }
    }).catch(() => {
      setBlocks(previous);
      toast('네트워크 오류가 발생했습니다.', 'error');
    });
  }, [profile.handle, blocks, toast]);

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
    <>
      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <nav className="editor-topnav">
        <div className="editor-topnav-inner">
          <Link href="/dashboard" className="editor-topnav-brand">
            thisis.at
          </Link>

          <div className="editor-topnav-links">
            <button
              type="button"
              className={`editor-topnav-item ${activePage === 'links' ? 'editor-topnav-item--active' : ''}`}
              onClick={() => setActivePage('links')}
            >
              {t('editor.nav.links')}
            </button>
            <button
              type="button"
              className={`editor-topnav-item ${activePage === 'appearance' ? 'editor-topnav-item--active' : ''}`}
              onClick={() => setActivePage('appearance')}
            >
              {t('editor.nav.appearance')}
            </button>
            <Link
              href={`/editor/@${profile.handle}/analytics`}
              className="editor-topnav-item"
            >
              {t('nav.analytics')}
            </Link>
          </div>

          <div className="editor-topnav-right">
            <LanguageSwitcher />
            <Link
              href={`/@${profile.handle}`}
              className="editor-topnav-view-btn"
            >
              {t('nav.viewProfile')}
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── 2-Column Content ───────────────────────────────── */}
      <main className="editor-layout">
        {/* Left: Editing Area */}
        <div className={`editor-content-area ${mobileView === 'preview' ? 'editor-content-area--hidden-mobile' : ''}`}>
          {/* ── Links Page ──────────────────────────────────── */}
          {activePage === 'links' && (
            <>
              {/* Profile Card with Avatar Upload & Info Editing */}
              <section className="card dash-card editor-profile-card">
                {/* Cover Image Upload */}
                <div className="editor-cover-upload">
                  <ImageUpload
                    handle={profile.handle}
                    value={coverUrl}
                    onChange={setCoverUrl}
                    onRemove={() => setCoverUrl(null)}
                    field="coverUrl"
                    aspect="landscape"
                    label="커버 이미지"
                  />
                </div>

                <div className="editor-profile-row">
                  <AvatarUpload
                    handle={profile.handle}
                    displayName={displayName}
                    avatarUrl={avatarUrl}
                    onAvatarChange={setAvatarUrl}
                  />
                  <div className="editor-profile-info">
                    <h1 style={{ margin: 0, fontSize: '1.15rem' }}>
                      <span className="gradient-text">@{profile.handle}</span>
                    </h1>
                    <p className="subtitle" style={{ margin: '0.25rem 0 0', fontSize: '0.85rem' }}>
                      {t('editor.subtitle')}
                    </p>
                  </div>
                </div>
                <div className="editor-profile-fields">
                  <div className="editor-field">
                    <CharCountInput
                      label={t('editor.profile.displayName')}
                      maxLength={50}
                      type="text"
                      className="editor-field-input"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder={t('editor.profile.displayNamePlaceholder')}
                    />
                  </div>
                  <div className="editor-field">
                    <CharCountInput
                      label={t('editor.profile.bio')}
                      maxLength={300}
                      multiline
                      className="editor-field-input editor-field-textarea"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={t('editor.profile.bioPlaceholder')}
                      rows={3}
                    />
                  </div>
                  <label className="editor-field">
                    <span className="editor-field-label">{t('editor.profile.location')}</span>
                    <input
                      type="text"
                      className="editor-field-input"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t('editor.profile.locationPlaceholder')}
                    />
                  </label>
                  <button
                    type="button"
                    className={`button-primary editor-profile-save ${hasProfileChanges ? 'editor-profile-save--unsaved' : ''}`}
                    onClick={handleProfileSave}
                    disabled={profileSaving}
                  >
                    {profileSaving ? t('common.saving') : t('editor.profile.save')}
                    {hasProfileChanges && <span className="unsaved-dot" aria-label="미저장 변경사항">●</span>}
                  </button>
                </div>
              </section>

              {/* Links header with code editor toggle */}
              <div className="links-page-header">
                <h2>{t('editor.nav.links')}</h2>
                <button
                  type="button"
                  className={`code-editor-toggle ${showCodeEditor ? 'code-editor-toggle--active' : ''}`}
                  onClick={() => setShowCodeEditor(!showCodeEditor)}
                  title="Code Editor"
                >
                  {'</>'}
                </button>
              </div>

              {showCodeEditor ? (
                <CodeEditorTab
                  blocks={blocks}
                  handle={profile.handle}
                  onBlocksChange={handleBlocksChange}
                />
              ) : (
                <BlocksTab
                  blocks={blocks}
                  handle={profile.handle}
                  profileType={profile.type}
                  onBlocksChange={handleBlocksChange}
                />
              )}
            </>
          )}

          {/* ── Appearance Page ─────────────────────────────── */}
          {activePage === 'appearance' && (
            <AppearancePage
              selectedTheme={selectedTheme}
              onSelectTheme={setSelectedTheme}
              selectedFontBody={selectedFontBody}
              selectedFontDisplay={selectedFontDisplay}
              onSelectBody={setSelectedFontBody}
              onSelectDisplay={setSelectedFontDisplay}
              buttonStyle={buttonStyle}
              cardStyle={cardStyle}
              showSparkles={showSparkles}
              onButtonStyle={setButtonStyle}
              onCardStyle={setCardStyle}
              onShowSparkles={setShowSparkles}
              handle={profile.handle}
            />
          )}
        </div>

        {/* Right: Live Preview */}
        <div className={`editor-preview-pane ${mobileView === 'preview' ? 'editor-preview-pane--show-mobile' : ''}`}>
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
            <span aria-hidden="true">✏️</span>
            {t('editor.tab.edit')}
          </button>
          <button
            type="button"
            className={`mobile-bottom-tab ${mobileView === 'preview' ? 'mobile-bottom-tab--active' : ''}`}
            onClick={() => setMobileView('preview')}
          >
            <span aria-hidden="true">👁️</span>
            {t('editor.preview')}
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
    </>
  );
}

/* ─── Appearance Page (Merged Theme + Fonts + Style) ──────── */

type AppearanceProps = {
  selectedTheme: string;
  onSelectTheme: (id: string) => void;
  selectedFontBody: string;
  selectedFontDisplay: string;
  onSelectBody: (id: string) => void;
  onSelectDisplay: (id: string) => void;
  buttonStyle: string;
  cardStyle: string;
  showSparkles: boolean;
  onButtonStyle: (s: string) => void;
  onCardStyle: (s: string) => void;
  onShowSparkles: (b: boolean) => void;
  handle: string;
};

function AppearancePage({
  selectedTheme,
  onSelectTheme,
  selectedFontBody,
  selectedFontDisplay,
  onSelectBody,
  onSelectDisplay,
  buttonStyle,
  cardStyle,
  showSparkles,
  onButtonStyle,
  onCardStyle,
  onShowSparkles,
  handle,
}: AppearanceProps) {
  const t = useT();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const categories = ['vibrant', 'light', 'dark', 'minimal'] as const;

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

  function handleSaveAll() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/customization`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            themeId: selectedTheme,
            fontBody: selectedFontBody,
            fontDisplay: selectedFontDisplay,
            buttonStyle,
            cardStyle,
            showSparkles,
          }),
        });
        if (res.ok) {
          toast('외관 설정이 저장되었습니다.', 'success');
        } else {
          toast('외관 설정 저장에 실패했습니다.', 'error');
        }
      } catch {
        toast('네트워크 오류가 발생했습니다.', 'error');
      }
    });
  }

  return (
    <div className="appearance-page">
      {/* Sticky save bar */}
      <div className="appearance-save-bar">
        <button className="button-primary" onClick={handleSaveAll} disabled={isPending} type="button">
          {isPending ? t('common.saving') : t('editor.saveAppearance')}
        </button>
      </div>

      {/* ── Themes Section ──────────────────────────────── */}
      <section>
        <h2 className="appearance-section-title">🎨 {t('editor.tab.theme')}</h2>
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
                    onSelect={() => onSelectTheme(theme.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Fonts Section ───────────────────────────────── */}
      <section>
        <h2 className="appearance-section-title">✍️ {t('editor.tab.fonts')}</h2>

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
                selected={selectedFontBody === font.id}
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
                selected={selectedFontDisplay === font.id}
                onSelect={() => onSelectDisplay(font.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Styles Section ──────────────────────────────── */}
      <section>
        <h2 className="appearance-section-title">💎 {t('editor.tab.style')}</h2>

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
    </div>
  );
}

/* ─── Theme Card ─────────────────────────────────────────── */

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

/* ─── Font Card ──────────────────────────────────────────── */

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
