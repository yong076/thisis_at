'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { SearchInput } from '@/components/admin/shared/search-input';
import { Pagination } from '@/components/admin/shared/pagination';
import { ConfirmDialog } from '@/components/admin/shared/confirm-dialog';

type Profile = {
  id: string;
  handle: string;
  displayName: string;
  type: string;
  isPublished: boolean;
  createdAt: string;
  ownerName: string | null;
  ownerEmail: string | null;
  blockCount: number;
  viewCount: number;
  eventCount: number;
};

const PROFILE_TYPES = [
  '', 'ARTIST', 'VENUE', 'CREATOR', 'BUSINESS',
  'INFLUENCER', 'PERSONAL', 'RESTAURANT', 'ORGANIZATION',
];

export function ProfilesTable({
  initialProfiles,
  initialTotal,
}: {
  initialProfiles: Profile[];
  initialTotal: number;
}) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [publishedFilter, setPublishedFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  const limit = 20;

  const fetchProfiles = useCallback(async (p: number, s: string, type: string, published: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit), search: s });
      if (type) params.set('type', type);
      if (published) params.set('published', published);
      const res = await fetch(`/api/admin/profiles?${params}`);
      const data = await res.json();
      if (data.profiles) {
        setProfiles(data.profiles);
        setTotal(data.total);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(1);
    fetchProfiles(1, value, typeFilter, publishedFilter);
  }

  function handleTypeFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setTypeFilter(v);
    setPage(1);
    fetchProfiles(1, search, v, publishedFilter);
  }

  function handlePublishedFilter(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    setPublishedFilter(v);
    setPage(1);
    fetchProfiles(1, search, typeFilter, v);
  }

  function handlePageChange(p: number) {
    setPage(p);
    fetchProfiles(p, search, typeFilter, publishedFilter);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/profiles/${deleteTarget.id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProfiles(page, search, typeFilter, publishedFilter);
      }
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Profiles</h1>
        <p className="adm-page-subtitle">전체 {total}개</p>
      </div>

      <div className="adm-toolbar">
        <SearchInput
          value={search}
          onChange={handleSearch}
          placeholder="핸들 또는 이름 검색..."
        />
        <select className="adm-filter-select" value={typeFilter} onChange={handleTypeFilter}>
          <option value="">전체 타입</option>
          {PROFILE_TYPES.filter(Boolean).map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <select className="adm-filter-select" value={publishedFilter} onChange={handlePublishedFilter}>
          <option value="">전체 상태</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>핸들</th>
                <th>이름</th>
                <th>타입</th>
                <th>상태</th>
                <th>블록</th>
                <th>조회수</th>
                <th>소유자</th>
                <th>생성일</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="adm-loading">불러오는 중...</td>
                </tr>
              ) : profiles.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                    검색 결과가 없습니다
                  </td>
                </tr>
              ) : (
                profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td style={{ fontWeight: 500 }}>@{profile.handle}</td>
                    <td>{profile.displayName}</td>
                    <td>
                      <span className={`badge badge--${profile.type.toLowerCase()}`}>
                        {profile.type}
                      </span>
                    </td>
                    <td>
                      <span className={`adm-status adm-status--${profile.isPublished ? 'published' : 'draft'}`}>
                        {profile.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{profile.blockCount}</td>
                    <td>{profile.viewCount.toLocaleString()}</td>
                    <td style={{ fontSize: '0.82rem' }}>{profile.ownerEmail || '-'}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {new Date(profile.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td>
                      <div className="adm-table-actions">
                        <Link
                          href={`/@${profile.handle}`}
                          className="adm-table-btn"
                          target="_blank"
                        >
                          보기
                        </Link>
                        <Link
                          href={`/editor/@${profile.handle}`}
                          className="adm-table-btn"
                        >
                          편집
                        </Link>
                        <button
                          className="adm-table-btn adm-table-btn--danger"
                          onClick={() => setDeleteTarget(profile)}
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
        title="프로필 삭제"
        message={`@${deleteTarget?.handle} (${deleteTarget?.displayName})을 삭제하시겠습니까? 관련된 모든 블록, 이벤트, 분석 데이터가 함께 삭제됩니다.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
