import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listProfiles } from '@/lib/db';
import { DefaultShell } from '@/components/public/default-shell';
import { Dashboard } from '@/components/admin/dashboard';

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const profiles = await listProfiles(session.user.id);

  return (
    <DefaultShell>
      <Dashboard
        profiles={profiles}
        userName={session.user.name ?? '관리자'}
        isAdmin={session.user.role === 'ADMIN'}
      />
    </DefaultShell>
  );
}
