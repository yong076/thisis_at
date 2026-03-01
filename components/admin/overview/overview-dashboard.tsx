'use client';

import { useState, useEffect } from 'react';

type Stats = {
  totalUsers: number;
  totalProfiles: number;
  totalPageViews: number;
  totalLinkClicks: number;
  recentSignups: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    role: string;
    createdAt: string;
    profileCount: number;
  }[];
};

export function OverviewDashboard({ initialStats }: { initialStats: Stats }) {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    // Refresh stats on mount
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => {
        if (data.totalUsers !== undefined) setStats(data);
      })
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Overview</h1>
        <p className="adm-page-subtitle">thisis.at 전체 현황</p>
      </div>

      {/* Stats Cards */}
      <div className="adm-stats-grid">
        <div className="card adm-stat-card">
          <div className="adm-stat-value">{stats.totalUsers.toLocaleString()}</div>
          <div className="adm-stat-label">전체 유저</div>
        </div>
        <div className="card adm-stat-card">
          <div className="adm-stat-value">{stats.totalProfiles.toLocaleString()}</div>
          <div className="adm-stat-label">발급된 at</div>
        </div>
        <div className="card adm-stat-card">
          <div className="adm-stat-value">{stats.totalPageViews.toLocaleString()}</div>
          <div className="adm-stat-label">총 방문자수</div>
        </div>
        <div className="card adm-stat-card">
          <div className="adm-stat-value">{stats.totalLinkClicks.toLocaleString()}</div>
          <div className="adm-stat-label">총 클릭수</div>
        </div>
      </div>

      {/* Recent Signups */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>
          최근 가입자
        </h3>
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>이름</th>
                <th>이메일</th>
                <th>역할</th>
                <th>프로필 수</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentSignups.map((user) => (
                <tr key={user.id}>
                  <td>{user.name || '-'}</td>
                  <td>{user.email || '-'}</td>
                  <td>
                    <span className={`adm-role-badge adm-role-badge--${user.role.toLowerCase()}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{user.profileCount}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString('ko-KR')}</td>
                </tr>
              ))}
              {stats.recentSignups.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                    가입자가 없습니다
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
