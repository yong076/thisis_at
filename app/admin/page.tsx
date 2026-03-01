import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listProfiles } from '@/lib/db';
import { getGlobalStats, getRecentSignups } from '@/lib/db/admin';
import { DefaultShell } from '@/components/public/default-shell';
import { Dashboard } from '@/components/admin/dashboard';
import { OverviewDashboard } from '@/components/admin/overview/overview-dashboard';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Regular users: show the simple dashboard
  if (session.user.role !== 'ADMIN') {
    const profiles = await listProfiles(session.user.id);
    return (
      <DefaultShell>
        <Dashboard profiles={profiles} userName={session.user.name ?? '관리자'} />
      </DefaultShell>
    );
  }

  // Admin users: show the overview dashboard
  try {
    const [stats, recentSignups] = await Promise.all([
      getGlobalStats(),
      getRecentSignups(10),
    ]);

    const initialStats = {
      ...stats,
      recentSignups: recentSignups.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        role: u.role,
        createdAt: u.createdAt.toISOString(),
        profileCount: u._count.profiles,
      })),
    };

    return <OverviewDashboard initialStats={initialStats} />;
  } catch (err) {
    console.error('[admin] Failed to load overview stats:', err);
    const fallback = {
      totalUsers: 0,
      totalProfiles: 0,
      totalPageViews: 0,
      totalLinkClicks: 0,
      recentSignups: [],
    };
    return <OverviewDashboard initialStats={fallback} />;
  }
}
