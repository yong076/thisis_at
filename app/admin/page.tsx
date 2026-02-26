'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { listProfiles } from '@/lib/mock-data';
import type { PublicProfile } from '@/lib/types';

const ADMIN_USER = 'yong076';
const ADMIN_PASS = 'asdqwe1231!';
const AUTH_KEY = 'thisis_admin_auth';

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(AUTH_KEY);
      if (stored === 'true') setAuthed(true);
    }
    setLoading(false);
  }, []);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setAuthed(true);
      setError('');
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다');
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
    setUsername('');
    setPassword('');
  }

  if (loading) {
    return (
      <main className="page" style={{ textAlign: 'center', paddingTop: '6rem' }}>
        <p className="subtitle">불러오는 중...</p>
      </main>
    );
  }

  if (!authed) {
    return <LoginForm {...{ username, setUsername, password, setPassword, error, onSubmit: handleLogin }} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

/* ------------------------------------------------------------ */
/*  Login                                                        */
/* ------------------------------------------------------------ */

function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  error,
  onSubmit,
}: {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <main className="page">
      <div className="login-container">
        <div className="card login-card animate-fade-up">
          <h1>
            <span className="gradient-text">thisis.at</span>
          </h1>
          <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
            관리자 대시보드
          </p>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-user">
                아이디
              </label>
              <input
                id="admin-user"
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="admin-pass">
                비밀번호
              </label>
              <input
                id="admin-pass"
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="button-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              로그인
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

/* ------------------------------------------------------------ */
/*  Dashboard                                                    */
/* ------------------------------------------------------------ */

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const profiles = listProfiles();

  return (
    <main className="page">
      {/* Header */}
      <div className="admin-header">
        <Link href="/" className="brand">
          thisis.at
        </Link>
        <button className="btn-logout" onClick={onLogout}>
          로그아웃
        </button>
      </div>

      {/* Welcome */}
      <section className="card admin-welcome animate-fade-up">
        <h1>
          돌아오셨군요, <span className="gradient-text">관리자</span>님
        </h1>
        <p className="subtitle">프로필, 블록, 설정을 여기서 관리하세요.</p>
      </section>

      {/* Stats */}
      <div className="admin-stats animate-fade-up animate-delay-1">
        <div className="card stat-card">
          <div className="stat-value">{profiles.length}</div>
          <div className="stat-label">프로필</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{profiles.reduce((sum, p) => sum + p.blocks.length, 0)}</div>
          <div className="stat-label">블록</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{profiles.reduce((sum, p) => sum + p.events.length, 0)}</div>
          <div className="stat-label">이벤트</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value">{profiles.filter((p) => p.type === 'ARTIST').length}</div>
          <div className="stat-label">아티스트</div>
        </div>
      </div>

      {/* Profiles */}
      <h2 style={{ margin: '0 0 0.75rem' }}>프로필 목록</h2>
      <div className="simple-grid">
        {profiles.map((profile, idx) => (
          <ProfileCard key={profile.id} profile={profile} delay={idx} />
        ))}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------ */
/*  Profile Card                                                 */
/* ------------------------------------------------------------ */

function badgeClass(type: string) {
  switch (type) {
    case 'ARTIST':
      return 'badge badge--artist';
    case 'VENUE':
      return 'badge badge--venue';
    default:
      return 'badge badge--creator';
  }
}

function ProfileCard({ profile, delay }: { profile: PublicProfile; delay: number }) {
  return (
    <article
      className={`card dash-profile-card animate-fade-up animate-delay-${Math.min(delay + 1, 4)}`}
    >
      {profile.avatarUrl ? (
        <Image
          src={profile.avatarUrl}
          alt={profile.displayName}
          className="dash-profile-avatar"
          width={56}
          height={56}
        />
      ) : (
        <div className="dash-profile-avatar" style={{ background: 'var(--gradient-soft)' }} />
      )}

      <div className="dash-profile-info">
        <strong>{profile.displayName}</strong>
        <p className="subtitle" style={{ fontSize: '0.85rem' }}>
          @{profile.handle} &middot; <span className={badgeClass(profile.type)}>{profile.type}</span>
        </p>
      </div>

      <div className="dash-profile-actions">
        <Link href={`/@${profile.handle}`} className="button-secondary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
          보기
        </Link>
        <Link href={`/editor/@${profile.handle}`} className="button-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}>
          편집
        </Link>
      </div>
    </article>
  );
}
