import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { eventId } = await params;
  const body = await req.json();

  const updateData: Record<string, unknown> = {};
  if (body.title !== undefined) updateData.title = body.title;
  if (body.startsAt !== undefined) updateData.startsAt = new Date(body.startsAt);
  if (body.venueName !== undefined) updateData.venueName = body.venueName;
  if (body.ticketUrl !== undefined) updateData.ticketUrl = body.ticketUrl || null;

  const event = await prisma.event.update({
    where: { id: eventId },
    data: updateData,
  });

  return NextResponse.json({ ok: true, event });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ eventId: string }> }
) {
  const check = await requireAdmin();
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: check.status });
  }

  const { eventId } = await params;

  await prisma.event.delete({ where: { id: eventId } });

  return NextResponse.json({ ok: true });
}
