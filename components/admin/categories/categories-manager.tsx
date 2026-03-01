'use client';

import { useState } from 'react';
import { ConfirmDialog } from '@/components/admin/shared/confirm-dialog';

type Category = {
  id: string;
  slug: string;
  nameKo: string;
  icon: string | null;
  order: number;
  profileCount: number;
};

export function CategoriesManager({
  initialCategories,
}: {
  initialCategories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ slug: '', nameKo: '', icon: '', order: 0 });
  const [error, setError] = useState('');

  async function fetchCategories() {
    const res = await fetch('/api/admin/categories');
    const data = await res.json();
    if (data.categories) setCategories(data.categories);
  }

  function startEdit(cat: Category) {
    setEditing(cat);
    setForm({ slug: cat.slug, nameKo: cat.nameKo, icon: cat.icon || '', order: cat.order });
    setError('');
  }

  function startCreate() {
    setShowCreate(true);
    setEditing(null);
    setForm({ slug: '', nameKo: '', icon: '', order: 0 });
    setError('');
  }

  async function handleSave() {
    setError('');

    if (editing) {
      const res = await fetch(`/api/admin/categories/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '저장 실패');
        return;
      }
      setEditing(null);
    } else {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || '생성 실패');
        return;
      }
      setShowCreate(false);
    }

    fetchCategories();
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/categories/${deleteTarget.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || '삭제 실패');
      setDeleteTarget(null);
      return;
    }
    setDeleteTarget(null);
    fetchCategories();
  }

  return (
    <div>
      <div className="adm-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="adm-page-title">Categories</h1>
          <p className="adm-page-subtitle">전체 {categories.length}개</p>
        </div>
        <button className="button-primary" onClick={startCreate} style={{ fontSize: '0.88rem', padding: '0.5rem 1rem' }}>
          + 카테고리 추가
        </button>
      </div>

      {error && (
        <div style={{ color: '#ef4444', fontSize: '0.88rem', marginBottom: '1rem', padding: '0.5rem 0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: '8px' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>아이콘</th>
                <th>Slug</th>
                <th>이름 (KO)</th>
                <th>순서</th>
                <th>프로필 수</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    카테고리가 없습니다
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id}>
                    <td style={{ fontSize: '1.2rem' }}>{cat.icon || '-'}</td>
                    <td style={{ fontWeight: 500 }}>{cat.slug}</td>
                    <td>{cat.nameKo}</td>
                    <td>{cat.order}</td>
                    <td>{cat.profileCount}</td>
                    <td>
                      <div className="adm-table-actions">
                        <button className="adm-table-btn" onClick={() => startEdit(cat)}>
                          편집
                        </button>
                        <button
                          className="adm-table-btn adm-table-btn--danger"
                          onClick={() => setDeleteTarget(cat)}
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      {(showCreate || editing) && (
        <>
          <div className="dialog-backdrop" onClick={() => { setShowCreate(false); setEditing(null); }} />
          <div className="adm-detail-dialog">
            <div className="adm-detail-header">
              <h3>{editing ? '카테고리 편집' : '카테고리 추가'}</h3>
              <button className="adm-detail-close" onClick={() => { setShowCreate(false); setEditing(null); }}>×</button>
            </div>
            <div className="adm-detail-body">
              {error && (
                <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</div>
              )}
              <div className="adm-detail-row">
                <label className="adm-detail-label">Slug</label>
                <input
                  className="adm-detail-input"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="music"
                />
              </div>
              <div className="adm-detail-row">
                <label className="adm-detail-label">이름 (KO)</label>
                <input
                  className="adm-detail-input"
                  value={form.nameKo}
                  onChange={(e) => setForm({ ...form, nameKo: e.target.value })}
                  placeholder="음악"
                />
              </div>
              <div className="adm-detail-row">
                <label className="adm-detail-label">아이콘</label>
                <input
                  className="adm-detail-input"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="🎵"
                />
              </div>
              <div className="adm-detail-row">
                <label className="adm-detail-label">순서</label>
                <input
                  className="adm-detail-input"
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="adm-detail-footer">
              <button className="button-secondary" onClick={() => { setShowCreate(false); setEditing(null); }}>
                취소
              </button>
              <button className="button-primary" onClick={handleSave}>
                {editing ? '저장' : '생성'}
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="카테고리 삭제"
        message={`"${deleteTarget?.nameKo}" 카테고리를 삭제하시겠습니까?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
