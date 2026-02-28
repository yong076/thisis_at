import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listProfiles } from '@/lib/db';
import { DefaultShell } from '@/components/public/default-shell';
import { Dashboard } from '@/components/admin/dashboard';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Only ADMIN can access
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const profiles = await listProfiles();

  return (
    <DefaultShell>
      <Dashboard profiles={profiles} userName={session.user.name ?? '관리자'} />
    </DefaultShell>
  );
}
