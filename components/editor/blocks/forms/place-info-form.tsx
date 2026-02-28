'use client';

import type { BlockFormProps } from '../block-edit-dialog';

export function PlaceInfoForm({ config, onChange }: BlockFormProps) {
  return (
    <>
      <div className="form-group">
        <label htmlFor="pi-address">주소</label>
        <input
          id="pi-address"
          type="text"
          value={(config.address as string) ?? ''}
          onChange={(e) => onChange({ ...config, address: e.target.value })}
          placeholder="서울시 마포구..."
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="pi-contact">연락처 (선택)</label>
        <input
          id="pi-contact"
          type="text"
          value={(config.contact as string) ?? ''}
          onChange={(e) => onChange({ ...config, contact: e.target.value })}
          placeholder="02-123-4567"
        />
      </div>
      <div className="form-group">
        <label htmlFor="pi-map">지도 URL (선택)</label>
        <input
          id="pi-map"
          type="url"
          value={(config.mapUrl as string) ?? ''}
          onChange={(e) => onChange({ ...config, mapUrl: e.target.value })}
          placeholder="https://map.naver.com/..."
        />
      </div>
    </>
  );
}
