'use client';

import type { BlockFormProps } from '../block-edit-dialog';

export function TicketCtaForm({ config, onChange }: BlockFormProps) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="tc-label">버튼 라벨</label>
        <input
          id="tc-label"
          type="text"
          value={(config.label as string) ?? ''}
          onChange={(e) => onChange({ ...config, label: e.target.value })}
          placeholder="예매하기"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="tc-url">예매 URL</label>
        <input
          id="tc-url"
          type="url"
          value={(config.url as string) ?? ''}
          onChange={(e) => onChange({ ...config, url: e.target.value })}
          placeholder="https://..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="tc-price">가격 (선택)</label>
        <input
          id="tc-price"
          type="text"
          value={(config.price as string) ?? ''}
          onChange={(e) => onChange({ ...config, price: e.target.value })}
          placeholder="₩30,000"
        />
      </div>
    </>
  );
}
