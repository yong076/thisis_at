'use client';

import type { BlockFormProps } from '../block-edit-dialog';

type SocialLink = { label: string; url: string; platform?: string };

export function SocialRowForm({ config, onChange }: BlockFormProps) {
  const links = (config.links as SocialLink[]) ?? [];

  function updateLink(index: number, field: keyof SocialLink, value: string) {
    const updated = links.map((l, i) => (i === index ? { ...l, [field]: value } : l));
    onChange({ ...config, links: updated });
  }

  function addLink() {
    onChange({ ...config, links: [...links, { label: '', url: '', platform: '' }] });
  }

  function removeLink(index: number) {
    onChange({ ...config, links: links.filter((_, i) => i !== index) });
  }

  return (
    <div className="form-group">
      <label>소셜 링크</label>
      {links.map((link, i) => (
        <div key={i} className="form-array-row">
          <input
            type="text"
            value={link.label}
            onChange={(e) => updateLink(i, 'label', e.target.value)}
            placeholder="라벨 (예: Instagram)"
            required
          />
          <input
            type="url"
            value={link.url}
            onChange={(e) => updateLink(i, 'url', e.target.value)}
            placeholder="https://..."
            required
          />
          <input
            type="text"
            value={link.platform ?? ''}
            onChange={(e) => updateLink(i, 'platform', e.target.value)}
            placeholder="플랫폼"
          />
          <button type="button" className="form-array-remove" onClick={() => removeLink(i)}>✕</button>
        </div>
      ))}
      <button type="button" className="form-array-add" onClick={addLink}>
        + 링크 추가
      </button>
    </div>
  );
}
