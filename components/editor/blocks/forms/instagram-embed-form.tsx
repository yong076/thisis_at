'use client';

import type { BlockFormProps } from '../block-edit-dialog';

export function InstagramEmbedForm({ config, onChange }: BlockFormProps) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="ig-url">Instagram 게시물 URL</label>
        <input
          id="ig-url"
          type="url"
          value={(config.postUrl as string) ?? ''}
          onChange={(e) => onChange({ ...config, postUrl: e.target.value })}
          placeholder="https://www.instagram.com/p/..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="ig-caption">캡션 (선택)</label>
        <input
          id="ig-caption"
          type="text"
          value={(config.caption as string) ?? ''}
          onChange={(e) => onChange({ ...config, caption: e.target.value })}
          placeholder="게시물 설명"
        />
      </div>
    </>
  );
}
