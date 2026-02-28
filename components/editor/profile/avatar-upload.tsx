'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { useT } from '@/lib/i18n/client';

type Props = {
  handle: string;
  displayName: string;
  avatarUrl?: string | null;
  onAvatarChange: (url: string) => void;
};

export function AvatarUpload({ handle, displayName, avatarUrl, onAvatarChange }: Props) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('field', 'avatarUrl');

      const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '업로드 실패');
        return;
      }

      onAvatarChange(data.url);
    } catch {
      setError('네트워크 오류');
    } finally {
      setUploading(false);
      // Reset input so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  const initials = displayName
    ? displayName.charAt(0).toUpperCase()
    : handle.charAt(0).toUpperCase();

  return (
    <div className="avatar-upload">
      <button
        type="button"
        className="avatar-upload-btn"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        aria-label={t('editor.changeAvatar') || 'Change avatar'}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={displayName}
            width={64}
            height={64}
            className="avatar-upload-img"
            unoptimized
          />
        ) : (
          <span className="avatar-upload-initials">{initials}</span>
        )}
        <span className="avatar-upload-overlay">
          {uploading ? (
            <span className="avatar-upload-spinner" />
          ) : (
            <span className="avatar-upload-icon">📷</span>
          )}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        hidden
      />
      {error && <p className="avatar-upload-error">{error}</p>}
    </div>
  );
}
