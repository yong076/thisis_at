import { prisma } from '@/lib/prisma';
import { normalizeHandle } from '@/lib/handle';
import type { PublicProfile, ProfileBlock, TrappistEvent, ProfileCustomization, ProfileCategory } from '@/lib/types';
import type { Profile, Block, Event, Category } from '@prisma/client';

// ─── Transformers ─────────────────────────────────────────────────

type ProfileWithRelations = Profile & {
  blocks: Block[];
  events: Event[];
  category?: Category | null;
};

function toProfileBlock(block: Block): ProfileBlock {
  return {
    id: block.id,
    type: block.type as ProfileBlock['type'],
    title: block.title ?? undefined,
    enabled: block.isEnabled,
    order: block.sortOrder,
    config: (block.configJson as Record<string, unknown>) ?? {},
  };
}

function toTrappistEvent(event: Event): TrappistEvent {
  return {
    id: event.id,
    title: event.title,
    startsAt: event.startsAt.toISOString(),
    venueName: event.venueName,
    ticketUrl: event.ticketUrl ?? undefined,
  };
}

function toCustomization(profile: Profile): ProfileCustomization {
  return {
    themeId: profile.themeId,
    fontBody: profile.fontBody,
    fontDisplay: profile.fontDisplay,
    customAccentColor: profile.customAccentColor ?? undefined,
    buttonStyle: (profile.buttonStyle as ProfileCustomization['buttonStyle']) ?? 'gradient',
    cardStyle: (profile.cardStyle as ProfileCustomization['cardStyle']) ?? 'glass',
    showSparkles: profile.showSparkles,
    profileLayout: (profile.profileLayout as ProfileCustomization['profileLayout']) ?? 'centered',
  };
}

function toCategoryInfo(category?: Category | null): ProfileCategory | undefined {
  if (!category) return undefined;
  return { slug: category.slug, nameKo: category.nameKo, icon: category.icon ?? undefined };
}

export function toPublicProfile(profile: ProfileWithRelations): PublicProfile {
  return {
    id: profile.id,
    handle: profile.handle,
    displayName: profile.displayName,
    type: profile.type as PublicProfile['type'],
    bio: profile.bio ?? '',
    location: profile.location ?? undefined,
    avatarUrl: profile.avatarUrl ?? undefined,
    coverUrl: profile.coverUrl ?? undefined,
    connectedTrappistArtistId: profile.connectedTrappistArtistId ?? undefined,
    connectedTrappistPlaceId: profile.connectedTrappistPlaceId ?? undefined,
    category: toCategoryInfo(profile.category),
    showVisitorCount: profile.showVisitorCount,
    blocks: profile.blocks.map(toProfileBlock),
    events: profile.events.map(toTrappistEvent),
    customization: toCustomization(profile),
  };
}

// ─── Include clause (reuse everywhere) ────────────────────────────

const profileInclude = {
  blocks: { orderBy: { sortOrder: 'asc' as const } },
  events: { orderBy: { startsAt: 'asc' as const } },
  category: true,
};

// ─── Queries ──────────────────────────────────────────────────────

export async function getProfileByHandle(rawHandle: string): Promise<PublicProfile | null> {
  const handle = normalizeHandle(rawHandle);

  const profile = await prisma.profile.findUnique({
    where: { handle },
    include: profileInclude,
  });

  return profile ? toPublicProfile(profile) : null;
}

export async function getProfileById(profileId: string): Promise<PublicProfile | null> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: profileInclude,
  });

  return profile ? toPublicProfile(profile) : null;
}

export async function listProfiles(): Promise<PublicProfile[]> {
  const profiles = await prisma.profile.findMany({
    include: profileInclude,
    orderBy: { createdAt: 'desc' },
  });

  return profiles.map(toPublicProfile);
}

export async function getEvents(params: {
  artistId?: string;
  placeId?: string;
  from?: string;
}): Promise<TrappistEvent[]> {
  const where: Record<string, unknown> = {};

  // Filter by profile's connected trappist IDs
  const profileFilters: Record<string, string>[] = [];
  if (params.artistId) {
    profileFilters.push({ connectedTrappistArtistId: params.artistId });
  }
  if (params.placeId) {
    profileFilters.push({ connectedTrappistPlaceId: params.placeId });
  }

  if (profileFilters.length > 0) {
    where.profile = { OR: profileFilters };
  }

  if (params.from) {
    where.startsAt = { gte: new Date(params.from) };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { startsAt: 'asc' },
  });

  return events.map(toTrappistEvent);
}
