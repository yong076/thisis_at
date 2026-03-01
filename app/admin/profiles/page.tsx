import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listAllProfiles } from '@/lib/db/admin';
import { ProfilesTable } from '@/components/admin/profiles/profiles-table';

export default async function AdminProfilesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  try {
    const { profiles, total } = await listAllProfiles({ page: 1, limit: 20 });

    const serialized = profiles.map((p) => ({
      id: p.id,
      handle: p.handle,
      displayName: p.displayName,
      type: p.type,
      isPublished: p.isPublished,
      createdAt: p.createdAt.toISOString(),
      ownerName: p.owner.name,
      ownerEmail: p.owner.email,
      blockCount: p._count.blocks,
      viewCount: p._count.pageViews,
      eventCount: p._count.events,
    }));

    return <ProfilesTable initialProfiles={serialized} initialTotal={total} />;
  } catch (err) {
    console.error('[admin] Failed to load profiles:', err);
    return <ProfilesTable initialProfiles={[]} initialTotal={0} />;
  }
}
