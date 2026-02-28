import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DefaultShell } from '@/components/public/default-shell';
import { LoginButton } from '@/components/auth/login-button';
import { getT } from '@/lib/i18n/server';

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect('/admin');
  }

  const t = getT();

  return (
    <DefaultShell>
      <main className="page">
        <div className="login-container">
          <div className="card login-card animate-fade-up">
            <h1>
              <span className="gradient-text">thisis.at</span>
            </h1>
            <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
              {t('login.title')}
            </p>
            <LoginButton />
          </div>
        </div>
      </main>
    </DefaultShell>
  );
}
