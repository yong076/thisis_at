import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { listUsers } from '@/lib/db/admin';
import { UsersTable } from '@/components/admin/users/users-table';

export default async function AdminUsersPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  try {
    const { users, total } = await listUsers({ page: 1, limit: 20 });

    const serialized = users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      profileCount: u._count.profiles,
    }));

    return <UsersTable initialUsers={serialized} initialTotal={total} />;
  } catch (err) {
    console.error('[admin] Failed to load users:', err);
    return <UsersTable initialUsers={[]} initialTotal={0} />;
  }
}
