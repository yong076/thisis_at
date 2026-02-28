'use client';

import type { BlockFormProps } from '../block-edit-dialog';

export function RichTextForm({ config, onChange }: BlockFormProps) {
  return (
    <div className="form-group">
      <label htmlFor="rt-html">HTML 텍스트</label>
      <textarea
        id="rt-html"
        value={(config.html as string) ?? ''}
        onChange={(e) => onChange({ ...config, html: e.target.value })}
        placeholder="<p>자유 형식의 텍스트를 입력하세요...</p>"
        rows={6}
        maxLength={10000}
        required
        className="form-textarea-code"
      />
      <p className="form-hint">HTML 태그를 사용할 수 있습니다. (p, strong, em, a, ul, li 등)</p>
    </div>
  );
}
