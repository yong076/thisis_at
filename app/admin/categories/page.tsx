import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { CategoriesManager } from '@/components/admin/categories/categories-manager';

export default async function AdminCategoriesPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/admin');
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { profiles: true } } },
  });

  const serialized = categories.map((c) => ({
    id: c.id,
    slug: c.slug,
    nameKo: c.nameKo,
    icon: c.icon,
    order: c.order,
    profileCount: c._count.profiles,
  }));

  return <CategoriesManager initialCategories={serialized} />;
}
