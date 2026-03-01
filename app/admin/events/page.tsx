import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listAllEvents } from '@/lib/db/admin';
import { EventsTable } from '@/components/admin/events/events-table';

export default async function AdminEventsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  try {
    const { events, total } = await listAllEvents({ page: 1, limit: 20 });

    const serialized = events.map((e) => ({
      id: e.id,
      title: e.title,
      startsAt: e.startsAt.toISOString(),
      venueName: e.venueName,
      ticketUrl: e.ticketUrl,
      createdAt: e.createdAt.toISOString(),
      profileId: e.profileId,
      profileHandle: e.profile.handle,
      profileName: e.profile.displayName,
    }));

    return <EventsTable initialEvents={serialized} initialTotal={total} />;
  } catch (err) {
    console.error('[admin] Failed to load events:', err);
    return <EventsTable initialEvents={[]} initialTotal={0} />;
  }
}
