import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminLayout } from '@/components/admin/admin-layout';

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Non-admin users: render children directly (the /admin page handles its own UI)
  if (session.user.role !== 'ADMIN') {
    return <>{children}</>;
  }

  // Admin users: wrap in the admin layout with sidebar
  return <AdminLayout>{children}</AdminLayout>;
}
