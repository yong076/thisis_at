'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useT } from '@/lib/i18n/client';

type DateRange = '7d' | '30d' | '90d' | 'all';

type OverviewData = {
  totalViews: number;
  uniqueVisitors: number;
  totalClicks: number;
};

type TimePoint = { date: string; views: number; uniques: number };
type ClickPoint = { date: string; clicks: number };
type BreakdownItem = { device?: string; browser?: string; country?: string; count: number };
type ReferrerItem = { referrer: string; count: number };
type CampaignItem = { source: string; medium: string; campaign: string; count: number };
type BlockClickItem = { blockId: string; blockType: string; label: string; clicks: number };

type AnalyticsData = {
  overview: OverviewData;
  viewsOverTime: TimePoint[];
  clicksOverTime: ClickPoint[];
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  countries: BreakdownItem[];
  referrers: ReferrerItem[];
  campaigns: CampaignItem[];
  topBlocks: BlockClickItem[];
};

const RANGE_KEYS: DateRange[] = ['7d', '30d', '90d', 'all'];

export function AnalyticsDashboard({ handle, displayName }: { handle: string; displayName: string }) {
  const t = useT();
  const [range, setRange] = useState<DateRange>('30d');
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/analytics?range=${range}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch {
      // silently ignore
    } finally {
      setLoading(false);
    }
  }, [handle, range]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const ctr = data && data.overview.totalViews > 0
    ? ((data.overview.totalClicks / data.overview.totalViews) * 100).toFixed(1)
    : '0.0';

  return (
    <main className="page">
      {/* Header */}
      <header className="admin-header">
        <Link href="/dashboard" className="brand">thisis.at</Link>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            href={`/editor/@${handle}`}
            className="button-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            {t('nav.editor')}
          </Link>
          <Link
            href={`/@${handle}`}
            className="button-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
          >
            {t('nav.viewProfile')}
          </Link>
        </div>
      </header>

      {/* Title */}
      <section className="card dash-card animate-fade-up" style={{ marginBottom: '1rem' }}>
        <h1>
          {(() => {
            const full = t('analytics.title', { handle: '__H__' });
            const [before] = full.split('@__H__');
            return <>{before}<span className="gradient-text">@{handle}</span></>;
          })()}
        </h1>
        <p className="subtitle">{t('analytics.subtitle', { name: displayName })}</p>
      </section>

      {/* Range Selector */}
      <div className="range-selector animate-fade-up">
        {RANGE_KEYS.map((r) => (
          <button
            key={r}
            className={`range-btn ${range === r ? 'range-btn--active' : ''}`}
            onClick={() => setRange(r)}
            type="button"
          >
            {t(`analytics.range.${r}`)}
          </button>
        ))}
      </div>

      {loading && !data ? (
        <AnalyticsSkeleton />
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="analytics-kpi-grid animate-fade-up">
            <KpiCard label={t('analytics.kpi.totalViews')} value={data.overview.totalViews} loading={loading} />
            <KpiCard label={t('analytics.kpi.uniqueVisitors')} value={data.overview.uniqueVisitors} loading={loading} />
            <KpiCard label={t('analytics.kpi.totalClicks')} value={data.overview.totalClicks} loading={loading} />
            <KpiCard label={t('analytics.kpi.ctr')} value={`${ctr}%`} loading={loading} />
          </div>

          {/* Views Chart */}
          <section className="card dash-card animate-fade-up" style={{ marginBottom: '1rem' }}>
            <h3 style={{ margin: '0 0 1rem' }}>{t('analytics.chart.dailyViews')}</h3>
            {data.viewsOverTime.length > 0 ? (
              <BarChart data={data.viewsOverTime} valueKey="views" secondaryKey="uniques" viewsLabel={t('analytics.chart.views')} uniqueLabel={t('analytics.chart.uniqueVisitors')} />
            ) : (
              <EmptyState message={t('analytics.chart.noData')} />
            )}
          </section>

          {/* Two-column: Devices & Browsers */}
          <div className="analytics-grid animate-fade-up">
            <section className="card dash-card">
              <h3 style={{ margin: '0 0 0.75rem' }}>{t('analytics.devices')}</h3>
              <BreakdownChart
                items={data.devices.map((d) => ({ label: d.device || 'unknown', count: d.count }))}
                emptyMsg={t('common.noData')}
              />
            </section>
            <section className="card dash-card">
              <h3 style={{ margin: '0 0 0.75rem' }}>{t('analytics.browsers')}</h3>
              <BreakdownChart
                items={data.browsers.map((b) => ({ label: b.browser || 'unknown', count: b.count }))}
                emptyMsg={t('common.noData')}
              />
            </section>
          </div>

          {/* Two-column: Countries & Referrers */}
          <div className="analytics-grid animate-fade-up" style={{ marginTop: '1rem' }}>
            <section className="card dash-card">
              <h3 style={{ margin: '0 0 0.75rem' }}>{t('analytics.countries')}</h3>
              <BreakdownChart
                items={data.countries.map((c) => ({
                  label: c.country === 'unknown' ? t('analytics.unknown') : (c.country || t('analytics.unknown')),
                  count: c.count,
                }))}
                emptyMsg={t('common.noData')}
              />
            </section>
            <section className="card dash-card">
              <h3 style={{ margin: '0 0 0.75rem' }}>{t('analytics.referrers')}</h3>
              <BreakdownChart
                items={data.referrers.map((r) => ({ label: r.referrer, count: r.count }))}
                emptyMsg={t('common.noData')}
              />
            </section>
          </div>

          {/* UTM Campaigns Table */}
          {data.campaigns.length > 0 && (
            <section className="card dash-card animate-fade-up" style={{ marginTop: '1rem' }}>
              <h3 style={{ margin: '0 0 0.75rem' }}>{t('analytics.utm.title')}</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>{t('analytics.utm.source')}</th>
                      <th>{t('analytics.utm.medium')}</th>
                      <th>{t('analytics.utm.campaign')}</th>
                      <th style={{ textAlign: 'right' }}>{t('analytics.utm.visits')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.campaigns.map((c, i) => (
                      <tr key={i}>
                        <td>{c.source}</td>
                        <td>{c.medium}</td>
                        <td>{c.campaign}</td>
                        <td style={{ textAlign: 'right' }}>{c.count.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Top Clicked Blocks Table */}
          {data.topBlocks.length > 0 && (
            <section className="card dash-card animate-fade-up" style={{ marginTop: '1rem' }}>
              <h3 style={{ margin: '0 0 0.75rem' }}>{t('analytics.topBlocks')}</h3>
              <div style={{ overflowX: 'auto' }}>
                <table className="analytics-table">
                  <thead>
                    <tr>
                      <th>{t('analytics.blockType')}</th>
                      <th>{t('analytics.label')}</th>
                      <th style={{ textAlign: 'right' }}>{t('analytics.clicks')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topBlocks.map((b, i) => (
                      <tr key={i}>
                        <td>
                          <span className="analytics-badge">
                            {t(`blockType.${b.blockType}`) !== `blockType.${b.blockType}` ? t(`blockType.${b.blockType}`) : b.blockType}
                          </span>
                        </td>
                        <td>{b.label}</td>
                        <td style={{ textAlign: 'right' }}>{b.clicks.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      ) : (
        <div className="card dash-card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <p>{t('analytics.noDataMsg')}</p>
        </div>
      )}
    </main>
  );
}

/* ─── KPI Card ─────────────────────────────────────────────────── */

function KpiCard({ label, value, loading }: { label: string; value: number | string; loading: boolean }) {
  return (
    <div className="card stat-card analytics-kpi-card">
      <div className={`stat-value ${loading ? 'analytics-pulse' : ''}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ─── Bar Chart (CSS-only) ─────────────────────────────────────── */

function BarChart({
  data,
  valueKey,
  secondaryKey,
  viewsLabel = 'Views',
  uniqueLabel = 'Unique',
}: {
  data: Array<Record<string, unknown>>;
  valueKey: string;
  secondaryKey?: string;
  viewsLabel?: string;
  uniqueLabel?: string;
}) {
  const maxVal = Math.max(...data.map((d) => Number(d[valueKey]) || 0), 1);

  return (
    <div className="chart-container">
      <div className="chart-bars">
        {data.map((d, i) => {
          const val = Number(d[valueKey]) || 0;
          const secVal = secondaryKey ? Number(d[secondaryKey]) || 0 : 0;
          const heightPct = (val / maxVal) * 100;
          const secHeightPct = secondaryKey ? (secVal / maxVal) * 100 : 0;
          const dateStr = String(d.date || '');
          const shortDate = dateStr.slice(5); // MM-DD

          return (
            <div key={i} className="chart-bar-group" title={`${dateStr}: ${val}${secondaryKey ? ` (${uniqueLabel}: ${secVal})` : ''}`}>
              <div className="chart-bar-wrapper">
                {secondaryKey && (
                  <div
                    className="chart-bar chart-bar--secondary"
                    style={{ height: `${secHeightPct}%` }}
                  />
                )}
                <div
                  className="chart-bar chart-bar--primary"
                  style={{ height: `${heightPct}%` }}
                />
              </div>
              <span className="chart-bar-label">{shortDate}</span>
            </div>
          );
        })}
      </div>
      {secondaryKey && (
        <div className="chart-legend">
          <span className="chart-legend-item">
            <span className="chart-legend-dot chart-legend-dot--primary" /> {viewsLabel}
          </span>
          <span className="chart-legend-item">
            <span className="chart-legend-dot chart-legend-dot--secondary" /> {uniqueLabel}
          </span>
        </div>
      )}
    </div>
  );
}

/* ─── Breakdown Chart (horizontal bars) ────────────────────────── */

function BreakdownChart({ items, emptyMsg = 'No data' }: { items: { label: string; count: number }[]; emptyMsg?: string }) {
  if (items.length === 0) return <EmptyState message={emptyMsg} />;

  const maxCount = Math.max(...items.map((i) => i.count), 1);
  const total = items.reduce((sum, i) => sum + i.count, 0);

  return (
    <div className="breakdown-list">
      {items.map((item, i) => (
        <div key={i} className="breakdown-row">
          <div className="breakdown-row-header">
            <span className="breakdown-label">{item.label}</span>
            <span className="breakdown-count">
              {item.count.toLocaleString()}
              <span className="breakdown-pct">
                ({total > 0 ? ((item.count / total) * 100).toFixed(1) : 0}%)
              </span>
            </span>
          </div>
          <div className="breakdown-bar">
            <div
              className="breakdown-bar-fill"
              style={{ width: `${(item.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Empty State ──────────────────────────────────────────────── */

function EmptyState({ message }: { message: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
      <p>{message}</p>
    </div>
  );
}

/* ─── Loading Skeleton ─────────────────────────────────────────── */

function AnalyticsSkeleton() {
  return (
    <div className="analytics-skeleton">
      <div className="analytics-kpi-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card stat-card analytics-skeleton-card">
            <div className="analytics-skeleton-bar" style={{ width: '60%', height: '1.8rem' }} />
            <div className="analytics-skeleton-bar" style={{ width: '40%', height: '0.8rem', marginTop: '0.5rem' }} />
          </div>
        ))}
      </div>
      <div className="card dash-card" style={{ marginTop: '1rem', minHeight: '200px' }}>
        <div className="analytics-skeleton-bar" style={{ width: '30%', height: '1rem', marginBottom: '1rem' }} />
        <div className="analytics-skeleton-bar" style={{ width: '100%', height: '150px' }} />
      </div>
    </div>
  );
}
