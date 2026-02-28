'use client';

import type { BlockFormProps } from '../block-edit-dialog';

export function EmbedForm({ config, onChange }: BlockFormProps) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="em-provider">제공자</label>
        <input
          id="em-provider"
          type="text"
          value={(config.provider as string) ?? ''}
          onChange={(e) => onChange({ ...config, provider: e.target.value })}
          placeholder="YouTube, SoundCloud 등"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="em-url">URL</label>
        <input
          id="em-url"
          type="url"
          value={(config.url as string) ?? ''}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>
    </>
  );
}
