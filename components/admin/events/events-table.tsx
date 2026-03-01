'use client';

import { useState, useCallback } from 'react';
import { Pagination } from '@/components/admin/shared/pagination';
import { ConfirmDialog } from '@/components/admin/shared/confirm-dialog';

type Event = {
  id: string;
  title: string;
  startsAt: string;
  venueName: string;
  ticketUrl: string | null;
  createdAt: string;
  profileId: string;
  profileHandle: string;
  profileName: string;
};

export function EventsTable({
  initialEvents,
  initialTotal,
}: {
  initialEvents: Event[];
  initialTotal: number;
}) {
  const [events, setEvents] = useState(initialEvents);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [editing, setEditing] = useState<Event | null>(null);
  const [editForm, setEditForm] = useState({ title: '', venueName: '', ticketUrl: '' });

  const limit = 20;

  const fetchEvents = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) });
      const res = await fetch(`/api/admin/events?${params}`);
      const data = await res.json();
      if (data.events) {
        setEvents(data.events);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  function handlePageChange(p: number) {
    setPage(p);
    fetchEvents(p);
  }

  function startEdit(event: Event) {
    setEditing(event);
    setEditForm({
      title: event.title,
      venueName: event.venueName,
      ticketUrl: event.ticketUrl || '',
    });
  }

  async function handleSaveEdit() {
    if (!editing) return;
    const res = await fetch(`/api/admin/events/${editing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editForm),
    });
    if (res.ok) {
      setEvents((prev) =>
        prev.map((e) =>
          e.id === editing.id
            ? { ...e, title: editForm.title, venueName: editForm.venueName, ticketUrl: editForm.ticketUrl || null }
            : e
        )
      );
      setEditing(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/events/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEvents(page);
      }
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Events</h1>
        <p className="adm-page-subtitle">전체 {total}개</p>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>장소</th>
                <th>일시</th>
                <th>프로필</th>
                <th>티켓</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="adm-loading">불러오는 중...</td>
                </tr>
              ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    이벤트가 없습니다
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr key={event.id}>
                    <td style={{ fontWeight: 500 }}>{event.title}</td>
                    <td>{event.venueName}</td>
                    <td style={{ fontSize: '0.82rem', whiteSpace: 'nowrap' }}>
                      {new Date(event.startsAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>@{event.profileHandle}</td>
                    <td>
                      {event.ticketUrl ? (
                        <a
                          href={event.ticketUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="adm-table-btn"
                          style={{ textDecoration: 'none' }}
                        >
                          링크
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button className="adm-table-btn" onClick={() => startEdit(event)}>
                          편집
                        </button>
                        <button
                          className="adm-table-btn adm-table-btn--danger"
                          onClick={() => setDeleteTarget(event)}
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

      <Pagination page={page} total={total} limit={limit} onPageChange={handlePageChange} />

      {/* Edit Dialog */}
      {editing && (
        <>
          <div className="dialog-backdrop" onClick={() => setEditing(null)} />
          <div className="adm-detail-dialog">
            <div className="adm-detail-header">
              <h3>이벤트 편집</h3>
              <button className="adm-detail-close" onClick={() => setEditing(null)}>×</button>
            </div>
            <div className="adm-detail-body">
              <div className="adm-detail-row">
                <label className="adm-detail-label">제목</label>
                <input
                  className="adm-detail-input"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div className="adm-detail-row">
                <label className="adm-detail-label">장소</label>
                <input
                  className="adm-detail-input"
                  value={editForm.venueName}
                  onChange={(e) => setEditForm({ ...editForm, venueName: e.target.value })}
                />
              </div>
              <div className="adm-detail-row">
                <label className="adm-detail-label">티켓 URL</label>
                <input
                  className="adm-detail-input"
                  value={editForm.ticketUrl}
                  onChange={(e) => setEditForm({ ...editForm, ticketUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="adm-detail-footer">
              <button className="button-secondary" onClick={() => setEditing(null)}>취소</button>
              <button className="button-primary" onClick={handleSaveEdit}>저장</button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="이벤트 삭제"
        message={`"${deleteTarget?.title}" 이벤트를 삭제하시겠습니까?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
