'use client';

import { useState, useEffect } from 'react';

type AnalyticsData = {
  topProfiles: { profileId: string; handle: string; displayName: string; views: number }[];
  viewsOverTime: { date: string; views: number; uniques: number }[];
  countryBreakdown: { country: string; count: number }[];
  deviceBreakdown: { device: string; count: number }[];
};

type DateRange = '7d' | '30d' | '90d' | 'all';

export function GlobalAnalytics({ initialData }: { initialData: AnalyticsData }) {
  const [data, setData] = useState(initialData);
  const [range, setRange] = useState<DateRange>('30d');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?range=${range}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.topProfiles) setData(d);
      })
      .finally(() => setLoading(false));
  }, [range]);

  const maxViews = Math.max(...(data.viewsOverTime.map((d) => d.views)), 1);
  const totalCountry = data.countryBreakdown.reduce((s, c) => s + c.count, 0) || 1;
  const totalDevice = data.deviceBreakdown.reduce((s, d) => s + d.count, 0) || 1;

  return (
    <div>
      <div className="adm-page-header">
        <h1 className="adm-page-title">Analytics</h1>
        <p className="adm-page-subtitle">전체 사이트 분석</p>
      </div>

      {/* Range Selector */}
      <div className="range-selector" style={{ marginBottom: '1.5rem' }}>
        {(['7d', '30d', '90d', 'all'] as DateRange[]).map((r) => (
          <button
            key={r}
            className={`range-btn${range === r ? ' range-btn--active' : ''}`}
            onClick={() => setRange(r)}
          >
            {r === '7d' ? '7일' : r === '30d' ? '30일' : r === '90d' ? '90일' : '전체'}
          </button>
        ))}
      </div>

      {loading && <div className="adm-loading">불러오는 중...</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Views Over Time */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>
            일별 방문자
          </h3>
          {data.viewsOverTime.length === 0 ? (
            <div className="adm-empty">데이터가 없습니다</div>
          ) : (
            <div className="chart-container">
              <div className="chart-bars">
                {data.viewsOverTime.slice(-30).map((d) => (
                  <div key={d.date} className="chart-bar-group">
                    <div className="chart-bar-wrapper">
                      <div
                        className="chart-bar chart-bar--primary"
                        style={{ height: `${(d.views / maxViews) * 100}%` }}
                        title={`${d.date}: ${d.views} views`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top Profiles */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>
            인기 프로필 Top 15
          </h3>
          {data.topProfiles.length === 0 ? (
            <div className="adm-empty">데이터가 없습니다</div>
          ) : (
            <div className="breakdown-list">
              {data.topProfiles.map((p, i) => {
                const maxP = data.topProfiles[0]?.views || 1;
                return (
                  <div key={p.profileId}>
                    <div className="breakdown-row-header">
                      <span className="breakdown-label">
                        {i + 1}. @{p.handle}
                      </span>
                      <span className="breakdown-count">{p.views.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-bar">
                      <div
                        className="breakdown-bar-fill"
                        style={{ width: `${(p.views / maxP) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Country Breakdown */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>
            국가별 방문
          </h3>
          {data.countryBreakdown.length === 0 ? (
            <div className="adm-empty">데이터가 없습니다</div>
          ) : (
            <div className="breakdown-list">
              {data.countryBreakdown.map((c) => (
                <div key={c.country}>
                  <div className="breakdown-row-header">
                    <span className="breakdown-label">{c.country}</span>
                    <span className="breakdown-count">
                      {c.count.toLocaleString()}
                      <span className="breakdown-pct">
                        ({((c.count / totalCountry) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-bar-fill"
                      style={{ width: `${(c.count / totalCountry) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Device Breakdown */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>
            디바이스 분포
          </h3>
          {data.deviceBreakdown.length === 0 ? (
            <div className="adm-empty">데이터가 없습니다</div>
          ) : (
            <div className="breakdown-list">
              {data.deviceBreakdown.map((d) => (
                <div key={d.device}>
                  <div className="breakdown-row-header">
                    <span className="breakdown-label">{d.device}</span>
                    <span className="breakdown-count">
                      {d.count.toLocaleString()}
                      <span className="breakdown-pct">
                        ({((d.count / totalDevice) * 100).toFixed(1)}%)
                      </span>
                    </span>
                  </div>
                  <div className="breakdown-bar">
                    <div
                      className="breakdown-bar-fill"
                      style={{ width: `${(d.count / totalDevice) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
