'use client';

import { useState, useCallback } from 'react';
import { Pagination } from '@/components/admin/shared/pagination';
import { ConfirmDialog } from '@/components/admin/shared/confirm-dialog';

type Block = {
  id: string;
  type: string;
  title: string | null;
  configJson: unknown;
  sortOrder: number;
  isEnabled: boolean;
  createdAt: string;
  profileId: string;
  profileHandle: string;
  profileName: string;
};

export function BlocksTable({
  initialBlocks,
  initialTotal,
}: {
  initialBlocks: Block[];
  initialTotal: number;
}) {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Block | null>(null);
  const [expandedJson, setExpandedJson] = useState<string | null>(null);

  const limit = 50;

  const fetchBlocks = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) });
      const res = await fetch(`/api/admin/blocks?${params}`);
      const data = await res.json();
      if (data.blocks) {
        setBlocks(data.blocks);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  function handlePageChange(p: number) {
    setPage(p);
    fetchBlocks(p);
  }

  async function handleToggleEnabled(block: Block) {
    const res = await fetch(`/api/admin/blocks/${block.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isEnabled: !block.isEnabled }),
    });
    if (res.ok) {
      setBlocks((prev) =>
        prev.map((b) => (b.id === block.id ? { ...b, isEnabled: !b.isEnabled } : b))
      );
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/blocks/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchBlocks(page);
      }
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Blocks</h1>
        <p className="adm-page-subtitle">전체 {total}개</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>타입</th>
                <th>제목</th>
                <th>프로필</th>
                <th>순서</th>
                <th>활성</th>
                <th>Config</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="adm-loading">불러오는 중...</td>
                </tr>
              ) : blocks.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    블록이 없습니다
                  </td>
                </tr>
              ) : (
                blocks.map((block) => (
                  <tr key={block.id}>
                    <td>
                      <span className="analytics-badge">{block.type}</span>
                    </td>
                    <td>{block.title || '-'}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      @{block.profileHandle}
                    </td>
                    <td>{block.sortOrder}</td>
                    <td>
                      <button
                        className={`adm-table-btn${block.isEnabled ? '' : ' adm-table-btn--danger'}`}
                        onClick={() => handleToggleEnabled(block)}
                        style={{ fontSize: '0.75rem' }}
                      >
                        {block.isEnabled ? 'ON' : 'OFF'}
                      </button>
                    </td>
                    <td>
                      <button
                        className="adm-table-btn"
                        onClick={() =>
                          setExpandedJson(expandedJson === block.id ? null : block.id)
                        }
                      >
                        {expandedJson === block.id ? '닫기' : 'JSON'}
                      </button>
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button
                          className="adm-table-btn adm-table-btn--danger"
                          onClick={() => setDeleteTarget(block)}
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

      {/* Expanded JSON viewer */}
      {expandedJson && (
        <div className="card" style={{ marginTop: '1rem', padding: '1rem' }}>
          <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.88rem' }}>
            Config JSON — {blocks.find((b) => b.id === expandedJson)?.type}
          </h4>
          <pre className="adm-json">
            {JSON.stringify(
              blocks.find((b) => b.id === expandedJson)?.configJson,
              null,
              2
            )}
          </pre>
        </div>
      )}

      <Pagination page={page} total={total} limit={limit} onPageChange={handlePageChange} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="블록 삭제"
        message={`이 ${deleteTarget?.type} 블록을 삭제하시겠습니까?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
