'use client';

import type { BlockFormProps } from '../block-edit-dialog';

export function TextAnnouncementForm({ config, onChange }: BlockFormProps) {
  return (
    <div className="form-group">
      <label htmlFor="ta-text">텍스트</label>
      <textarea
        id="ta-text"
        value={(config.text as string) ?? ''}
        onChange={(e) => onChange({ ...config, text: e.target.value })}
        placeholder="공지사항이나 짧은 텍스트..."
        rows={4}
        maxLength={2000}
        required
      />
    </div>
  );
}
