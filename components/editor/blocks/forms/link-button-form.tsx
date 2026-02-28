'use client';

import type { BlockFormProps } from '../block-edit-dialog';

export function LinkButtonForm({ config, onChange }: BlockFormProps) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="lb-label">버튼 라벨</label>
        <input
          id="lb-label"
          type="text"
          value={(config.label as string) ?? ''}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          placeholder="예: Spotify에서 듣기"
          maxLength={100}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lb-url">URL</label>
        <input
          id="lb-url"
          type="url"
          value={(config.url as string) ?? ''}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="lb-icon">아이콘 (선택)</label>
        <input
          id="lb-icon"
          type="text"
          value={(config.icon as string) ?? ''}
          onChange={(e) => onChange({ ...config, icon: e.target.value })}
          placeholder="이모지 또는 아이콘 이름"
        />
      </div>
    </>
  );
}
