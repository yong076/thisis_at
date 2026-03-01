'use client';

import type { BlockFormProps } from '../block-edit-dialog';
import { ImageUpload } from '../../shared/image-upload';

export function MediaGalleryForm({ config, onChange, handle }: BlockFormProps) {
  const images = (config.images as string[]) ?? [];

  function addImage(url: string) {
    onChange({ ...config, images: [...images, url] });
  }

  function removeImage(index: number) {
    onChange({ ...config, images: images.filter((_, i) => i !== index) });
  }

  return (
    <div className="form-group">
      <label>갤러리 이미지 ({images.length}/20)</label>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div className="gallery-form-grid">
          {images.map((url, i) => (
            <div key={`${url}-${i}`} className="gallery-form-item">
              <ImageUpload
                handle={handle!}
                value={url}
                onChange={(newUrl) => {
                  const updated = [...images];
                  updated[i] = newUrl;
                  onChange({ ...config, images: updated });
                }}
                onRemove={() => removeImage(i)}
                field="blockImage"
                aspect="square"
                compact
              />
            </div>
          ))}
        </div>
      )}

      {/* Add new image */}
      {images.length < 20 && (
        <ImageUpload
          handle={handle!}
          value={null}
          onChange={addImage}
          field="blockImage"
          aspect="landscape"
          label="갤러리에 이미지 추가"
          compact
        />
      )}
    </div>
  );
}
