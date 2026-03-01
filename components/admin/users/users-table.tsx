'use client';

import { useState, useCallback } from 'react';
import { SearchInput } from '@/components/admin/shared/search-input';
import { Pagination } from '@/components/admin/shared/pagination';
import { ConfirmDialog } from '@/components/admin/shared/confirm-dialog';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: string;
  createdAt: string;
  profileCount: number;
};

export function UsersTable({
  initialUsers,
  initialTotal,
}: {
  initialUsers: User[];
  initialTotal: number;
}) {
  const [users, setUsers] = useState(initialUsers);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);

  const limit = 20;

  const fetchUsers = useCallback(async (p: number, s: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit), search: s });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
    fetchUsers(1, value);
  }

  function handlePageChange(p: number) {
    setPage(p);
    fetchUsers(p, search);
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setEditingRole(userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
      }
    } finally {
      setEditingRole(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers(page, search);
      }
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Users</h1>
        <p className="adm-page-subtitle">전체 {total}명</p>
      </div>

      <div className="adm-toolbar">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="이름 또는 이메일 검색..."
        />
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>프로필 수</th>
                <th>가입일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="adm-loading">불러오는 중...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    검색 결과가 없습니다
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: 500 }}>{user.name || '-'}</td>
                    <td style={{ fontSize: '0.82rem' }}>{user.email || '-'}</td>
                    <td>
                      <select
                        className="adm-detail-select"
                        style={{ width: 'auto', padding: '0.25rem 0.5rem', fontSize: '0.78rem' }}
                        value={user.role}
                        disabled={editingRole === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>{user.profileCount}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <button
                          className="adm-table-btn adm-table-btn--danger"
                          onClick={() => setDeleteTarget(user)}
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

      <ConfirmDialog
        open={!!deleteTarget}
        title="유저 삭제"
        message={`${deleteTarget?.name || deleteTarget?.email || '이 유저'}를 삭제하시겠습니까? 관련된 모든 프로필, 블록, 이벤트, 분석 데이터가 함께 삭제됩니다.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
