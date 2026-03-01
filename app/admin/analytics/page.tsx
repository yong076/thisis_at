import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import {
  getTopProfilesByViews,
  getGlobalViewsOverTime,
  getGlobalCountryBreakdown,
  getGlobalDeviceBreakdown,
} from '@/lib/db/admin';
import { GlobalAnalytics } from '@/components/admin/analytics/global-analytics';

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const [topProfiles, viewsOverTime, countryBreakdown, deviceBreakdown] = await Promise.all([
    getTopProfilesByViews('30d', 15),
    getGlobalViewsOverTime('30d'),
    getGlobalCountryBreakdown('30d'),
    getGlobalDeviceBreakdown('30d'),
  ]);

  return (
    <GlobalAnalytics
      initialData={{ topProfiles, viewsOverTime, countryBreakdown, deviceBreakdown }}
    />
  );
}
