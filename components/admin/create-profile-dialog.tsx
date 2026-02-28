'use client';

import { useEffect, useRef, useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useT } from '@/lib/i18n/client';

const PROFILE_TYPE_KEYS = [
  { value: 'ARTIST', emoji: '🎵' },
  { value: 'VENUE', emoji: '🏛️' },
  { value: 'CREATOR', emoji: '✨' },
  { value: 'BUSINESS', emoji: '🏢' },
  { value: 'INFLUENCER', emoji: '📱' },
  { value: 'PERSONAL', emoji: '👤' },
  { value: 'RESTAURANT', emoji: '🍽️' },
  { value: 'ORGANIZATION', emoji: '🏛️' },
];

export function CreateProfileDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const [handle, setHandle] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [handleStatus, setHandleStatus] = useState<{
    checking: boolean;
    available?: boolean;
    reason?: string;
  }>({ checking: false });
  const [selectedType, setSelectedType] = useState('CREATOR');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const checkTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Open/close dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Handle availability check (debounced)
  const checkHandle = useCallback((value: string) => {
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    if (value.length < 3) {
      setHandleStatus({ checking: false });
      return;
    }

    setHandleStatus({ checking: true });
    checkTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/admin/profiles/check-handle?handle=${encodeURIComponent(value)}`);
        const result = await res.json();
        setHandleStatus({
          checking: false,
          available: result.available,
          reason: result.reason,
        });
      } catch {
        setHandleStatus({ checking: false });
      }
    }, 400);
  }, []);

  function handleHandleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '');
    setHandle(value);
    checkHandle(value);
  }

  function handleClose() {
    setHandle('');
    setDisplayName('');
    setBio('');
    setError('');
    setHandleStatus({ checking: false });
    setSelectedType('CREATOR');
    onClose();
  }

  // Close on backdrop click
  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom
    ) {
      handleClose();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/profiles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            handle,
            displayName: displayName.trim(),
            type: selectedType,
            bio: bio.trim(),
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? t('common.error.create'));
          return;
        }

        // Success - redirect to editor
        handleClose();
        router.push(`/editor/@${data.handle}`);
        router.refresh();
      } catch {
        setError(t('common.error.network'));
      }
    });
  }

  return (
    <dialog
      ref={dialogRef}
      className="create-profile-dialog"
      onClick={handleDialogClick}
      onClose={handleClose}
    >
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>
            <span className="gradient-text">{t('createProfile.title')}</span>
          </h2>
          <button className="dialog-close" onClick={handleClose} type="button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Handle */}
          <div className="form-group">
            <label htmlFor="handle">{t('createProfile.handle')}</label>
            <div className="handle-input-wrap">
              <span className="handle-prefix">@</span>
              <input
                id="handle"
                name="handle"
                type="text"
                value={handle}
                onChange={handleHandleChange}
                placeholder="my.profile"
                maxLength={30}
                required
                autoComplete="off"
              />
            </div>
            <HandleStatusIndicator status={handleStatus} handle={handle} />
            <p className="form-hint">{t('createProfile.handleHint')}</p>
          </div>

          {/* Display Name */}
          <div className="form-group">
            <label htmlFor="displayName">{t('createProfile.displayName')}</label>
            <input
              id="displayName"
              name="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="My Band"
              maxLength={50}
              required
            />
          </div>

          {/* Profile Type */}
          <div className="form-group">
            <label>{t('createProfile.profileType')}</label>
            <div className="type-selector">
              {PROFILE_TYPE_KEYS.map((pt) => (
                <button
                  key={pt.value}
                  type="button"
                  className={`type-option ${selectedType === pt.value ? 'type-option--active' : ''}`}
                  onClick={() => setSelectedType(pt.value)}
                >
                  <span className="type-emoji">{pt.emoji}</span>
                  <strong>{t(`profileType.${pt.value}`)}</strong>
                  <small>{t(`profileTypeDesc.${pt.value}`)}</small>
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label htmlFor="bio">{t('createProfile.bio')}</label>
            <textarea
              id="bio"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('createProfile.bioPlaceholder')}
              rows={3}
              maxLength={300}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="form-error">{error}</div>
          )}

          {/* Actions */}
          <div className="dialog-actions">
            <button type="button" className="button-secondary" onClick={handleClose}>
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="button-primary"
              disabled={isPending || handleStatus.checking || handleStatus.available === false || !handle || !displayName.trim()}
            >
              {isPending ? t('common.creating') : t('createProfile.submit')}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

function HandleStatusIndicator({
  status,
  handle,
}: {
  status: { checking: boolean; available?: boolean; reason?: string };
  handle: string;
}) {
  const t = useT();

  if (handle.length < 3) return null;

  if (status.checking) {
    return <p className="handle-status handle-status--checking">{t('createProfile.handleChecking')}</p>;
  }

  if (status.available === true) {
    return <p className="handle-status handle-status--available">{t('createProfile.handleAvailable')}</p>;
  }

  if (status.available === false) {
    return <p className="handle-status handle-status--taken">{status.reason}</p>;
  }

  return null;
}
