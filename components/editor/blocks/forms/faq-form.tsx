'use client';

import type { BlockFormProps } from '../block-edit-dialog';

type FaqItem = { question: string; answer: string };

export function FaqForm({ config, onChange }: BlockFormProps) {
  const items = (config.items as FaqItem[]) ?? [];

  function updateItem(index: number, field: keyof FaqItem, value: string) {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange({ ...config, items: updated });
  }

  function addItem() {
    onChange({ ...config, items: [...items, { question: '', answer: '' }] });
  }

  function removeItem(index: number) {
    onChange({ ...config, items: items.filter((_, i) => i !== index) });
  }

  return (
    <div className="form-group">
      <label>Q&A 목록</label>
      {items.map((item, i) => (
        <div key={i} className="form-array-block">
          <div className="form-array-block-header">
            <strong>Q&A #{i + 1}</strong>
            <button type="button" className="form-array-remove" onClick={() => removeItem(i)}>✕</button>
          </div>
          <input
            type="text"
            value={item.question}
            onChange={(e) => updateItem(i, 'question', e.target.value)}
            placeholder="질문"
            required
          />
          <textarea
            value={item.answer}
            onChange={(e) => updateItem(i, 'answer', e.target.value)}
            placeholder="답변"
            rows={2}
            required
          />
        </div>
      ))}
      <button type="button" className="form-array-add" onClick={addItem}>
        + Q&A 추가
      </button>
    </div>
  );
}
