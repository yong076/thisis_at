import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { DefaultShell } from '@/components/public/default-shell';
import { TopNav } from '@/components/public/top-nav';

export default async function AccountSettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <DefaultShell>
      <main className="page">
        <TopNav />
        <section className="card dash-card animate-fade-up">
          <h1>계정 설정</h1>
          <p className="subtitle" style={{ marginBottom: '1.5rem' }}>인증 및 계정 정보를 관리합니다.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="card" style={{ padding: '1rem' }}>
              <p className="subtitle" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>이름</p>
              <strong>{session.user.name ?? '-'}</strong>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <p className="subtitle" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>이메일</p>
              <strong>{session.user.email ?? '-'}</strong>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <p className="subtitle" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>역할</p>
              <strong>
                <span className="badge badge--artist">{session.user.role}</span>
              </strong>
            </div>
            <div className="card" style={{ padding: '1rem' }}>
              <p className="subtitle" style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>인증 방식</p>
              <strong>Google OAuth</strong>
            </div>
          </div>
        </section>
      </main>
    </DefaultShell>
  );
}
