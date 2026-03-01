'use client';

import { useRef, useState, useCallback, type DragEvent } from 'react';
import Image from 'next/image';
import { useToast } from '@/components/ui/toast';

type Props = {
  handle: string;
  value: string | null;
  onChange: (url: string) => void;
  onRemove?: () => void;
  field?: 'avatarUrl' | 'coverUrl' | 'blockImage';
  aspect?: 'square' | 'landscape' | 'portrait';
  maxSizeMB?: number;
  label?: string;
  className?: string;
  compact?: boolean;
};

export function ImageUpload({
  handle,
  value,
  onChange,
  onRemove,
  field = 'blockImage',
  aspect = 'landscape',
  maxSizeMB,
  label,
  className = '',
  compact = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const { toast } = useToast();

  const maxSize = (maxSizeMB ?? (field === 'blockImage' ? 5 : 2)) * 1024 * 1024;

  const upload = useCallback(
    async (file: File) => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        toast('JPG, PNG, WebP만 지원됩니다.', 'error');
        return;
      }
      if (file.size > maxSize) {
        toast(`${maxSize / (1024 * 1024)}MB 이하만 가능합니다.`, 'error');
        return;
      }

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('field', field);

        const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || '업로드 실패');
        }

        const data = await res.json();
        onChange(data.url);
        toast('이미지가 업로드되었습니다.', 'success');
      } catch (err) {
        toast(err instanceof Error ? err.message : '업로드 실패', 'error');
      } finally {
        setUploading(false);
      }
    },
    [handle, field, maxSize, onChange, toast],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) upload(file);
      // Reset so re-selecting the same file still triggers onChange
      e.target.value = '';
    },
    [upload],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) upload(file);
    },
    [upload],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
  }, []);

  const aspectClass =
    aspect === 'square'
      ? 'img-upload--square'
      : aspect === 'portrait'
        ? 'img-upload--portrait'
        : 'img-upload--landscape';

  return (
    <div
      className={`img-upload ${aspectClass} ${dragging ? 'img-upload--dragging' : ''} ${compact ? 'img-upload--compact' : ''} ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        className="img-upload-input"
        aria-label={label ?? 'Upload image'}
      />

      {value ? (
        <div className="img-upload-preview">
          <Image
            src={value}
            alt={label ?? 'Uploaded image'}
            fill
            sizes="300px"
            style={{ objectFit: 'cover' }}
            unoptimized={value.startsWith('data:')}
          />
          <div className="img-upload-overlay">
            <button
              type="button"
              className="img-upload-btn"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              변경
            </button>
            {onRemove && (
              <button
                type="button"
                className="img-upload-btn img-upload-btn--danger"
                onClick={onRemove}
                disabled={uploading}
              >
                삭제
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="img-upload-dropzone"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
        >
          {uploading ? (
            <div className="img-upload-spinner" />
          ) : (
            <>
              <span className="img-upload-icon">📷</span>
              <span className="img-upload-text">
                {compact ? '업로드' : '클릭하거나 드래그하여 업로드'}
              </span>
            </>
          )}
        </div>
      )}

      {uploading && value && (
        <div className="img-upload-loading">
          <div className="img-upload-spinner" />
        </div>
      )}
    </div>
  );
}
