'use client';

import type { BlockFormProps } from '../block-edit-dialog';

type Product = { name: string; price: string; description?: string; imageUrl?: string; url?: string };

export function ProductCardsForm({ config, onChange }: BlockFormProps) {
  const products = (config.products as Product[]) ?? [];

  function updateProduct(index: number, field: keyof Product, value: string) {
    const updated = products.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    onChange({ ...config, products: updated });
  }

  function addProduct() {
    onChange({ ...config, products: [...products, { name: '', price: '', description: '', imageUrl: '', url: '' }] });
  }

  function removeProduct(index: number) {
    onChange({ ...config, products: products.filter((_, i) => i !== index) });
  }

  return (
    <div className="form-group">
      <label>상품 목록</label>
      {products.map((product, i) => (
        <div key={i} className="form-array-block">
          <div className="form-array-block-header">
            <strong>상품 #{i + 1}</strong>
            <button type="button" className="form-array-remove" onClick={() => removeProduct(i)}>✕</button>
          </div>
          <input
            type="text"
            value={product.name}
            onChange={(e) => updateProduct(i, 'name', e.target.value)}
            placeholder="상품명"
            required
          />
          <input
            type="text"
            value={product.price}
            onChange={(e) => updateProduct(i, 'price', e.target.value)}
            placeholder="가격 (예: ₩15,000)"
            required
          />
          <input
            type="text"
            value={product.description ?? ''}
            onChange={(e) => updateProduct(i, 'description', e.target.value)}
            placeholder="설명 (선택)"
          />
          <input
            type="url"
            value={product.imageUrl ?? ''}
            onChange={(e) => updateProduct(i, 'imageUrl', e.target.value)}
            placeholder="이미지 URL (선택)"
          />
          <input
            type="url"
            value={product.url ?? ''}
            onChange={(e) => updateProduct(i, 'url', e.target.value)}
            placeholder="상품 링크 (선택)"
          />
        </div>
      ))}
      <button type="button" className="form-array-add" onClick={addProduct}>
        + 상품 추가
      </button>
    </div>
  );
}
