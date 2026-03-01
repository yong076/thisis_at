import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getProfileByHandle } from '@/lib/db';
import { normalizeHandle } from '@/lib/handle';
import { DefaultShell } from '@/components/public/default-shell';
import { AnalyticsDashboard } from '@/components/editor/analytics/analytics-dashboard';
import { prisma } from '@/lib/prisma';

export default async function AnalyticsPage({ params }: { params: { handle: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const normalized = normalizeHandle(params.handle);
  const profile = await getProfileByHandle(normalized);

  if (!profile) {
    notFound();
  }

  // Check ownership
  if (session.user.role !== 'ADMIN') {
    const ownsProfile = await prisma.profile.findFirst({
      where: { handle: normalized, userId: session.user.id },
    });

    if (!ownsProfile) {
      redirect('/dashboard');
    }
  }

  return (
    <DefaultShell>
      <AnalyticsDashboard handle={profile.handle} displayName={profile.displayName} />
    </DefaultShell>
  );
}
