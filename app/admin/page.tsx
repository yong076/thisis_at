import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getGlobalStats, getRecentSignups } from '@/lib/db/admin';
import { OverviewDashboard } from '@/components/admin/overview/overview-dashboard';

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Non-admin users: send to dashboard instead
  if (session.user.role !== 'ADMIN') {
    redirect('/dashboard');
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
