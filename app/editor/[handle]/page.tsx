import { redirect, notFound } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getProfileByHandle } from '@/lib/db';
import { normalizeHandle } from '@/lib/handle';
import { DefaultShell } from '@/components/public/default-shell';
import { EditorContent } from '@/components/editor/editor-content';
import { ToastProvider } from '@/components/ui/toast';
import { prisma } from '@/lib/prisma';

export default async function EditorPage({ params }: { params: { handle: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const normalized = normalizeHandle(params.handle);
  const profile = await getProfileByHandle(normalized);

  if (!profile) {
    notFound();
  }

  // Check ownership: user must own this profile or be ADMIN
  if (session.user.role !== 'ADMIN') {
    const ownsProfile = await prisma.profile.findFirst({
      where: {
        handle: normalized,
        userId: session.user.id,
      },
    });

    if (!ownsProfile) {
      redirect('/admin');
    }
  }

  return (
    <DefaultShell>
      <ToastProvider>
        <EditorContent profile={profile} />
      </ToastProvider>
    </DefaultShell>
  );
}
