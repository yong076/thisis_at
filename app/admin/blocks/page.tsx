import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listAllBlocks } from '@/lib/db/admin';
import { BlocksTable } from '@/components/admin/blocks/blocks-table';

export default async function AdminBlocksPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  try {
    const { blocks, total } = await listAllBlocks({ page: 1, limit: 50 });

    const serialized = blocks.map((b) => ({
      id: b.id,
      type: b.type,
      title: b.title,
      configJson: b.configJson,
      sortOrder: b.sortOrder,
      isEnabled: b.isEnabled,
      createdAt: b.createdAt.toISOString(),
      profileId: b.profileId,
      profileHandle: b.profile.handle,
      profileName: b.profile.displayName,
    }));

    return <BlocksTable initialBlocks={serialized} initialTotal={total} />;
  } catch (err) {
    console.error('[admin] Failed to load blocks:', err);
    return <BlocksTable initialBlocks={[]} initialTotal={0} />;
  }
}
