import { normalizeHandle } from '@/lib/handle';
import type { PublicProfile, TrappistEvent } from '@/lib/types';

const profiles: PublicProfile[] = [
  {
    id: 'profile-band-lucid',
    handle: 'lucid.band',
    displayName: 'LUCID BAND',
    type: 'ARTIST',
    bio: 'Seoul alt-pop band. New single out now. Live every month.',
    location: 'Seoul, KR',
    avatarUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=480&q=80',
    coverUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
    connectedTrappistArtistId: 'artist_lucid_001',
    blocks: [
      {
        id: 'blk1',
        type: 'TEXT_ANNOUNCEMENT',
        title: 'Announcement',
        enabled: true,
        order: 1,
        config: {
          text: '3월 15일 쇼케이스 티켓 오픈. 선착순 한정 굿즈 포함.'
        }
      },
      {
        id: 'blk2',
        type: 'LINK_BUTTON',
        title: 'New Single',
        enabled: true,
        order: 2,
        config: {
          label: 'Listen on Spotify',
          url: 'https://open.spotify.com/'
        }
      },
      {
        id: 'blk3',
        type: 'SOCIAL_ROW',
        enabled: true,
        order: 3,
        config: {
          links: [
            { label: 'Instagram', url: 'https://instagram.com' },
            { label: 'YouTube', url: 'https://youtube.com' },
            { label: 'TikTok', url: 'https://tiktok.com' }
          ]
        }
      },
      {
        id: 'blk4',
        type: 'EVENTS',
        title: 'Upcoming Events',
        enabled: true,
        order: 4,
        config: {}
      },
      {
        id: 'blk5',
        type: 'MEDIA_GALLERY',
        title: 'Gallery',
        enabled: true,
        order: 5,
        config: {
          images: [
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80'
          ]
        }
      }
    ],
    events: [
      {
        id: 'evt1',
        title: 'LUCID Showcase',
        startsAt: '2026-03-15T19:00:00+09:00',
        venueName: 'Moonlight Hall',
        ticketUrl: 'https://example.com/tickets/lucid-showcase'
      },
      {
        id: 'evt2',
        title: 'City Night Fest',
        startsAt: '2026-03-29T20:00:00+09:00',
        venueName: 'Han River Stage',
        ticketUrl: 'https://example.com/tickets/city-night-fest'
      }
    ]
  },
  {
    id: 'profile-venue-moonlight',
    handle: 'moonlight_hall',
    displayName: 'Moonlight Hall',
    type: 'VENUE',
    bio: 'Live house for indie, post-rock, and experimental nights.',
    location: 'Mapo-gu, Seoul',
    avatarUrl:
      'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=480&q=80',
    connectedTrappistPlaceId: 'place_moonlight_001',
    blocks: [
      {
        id: 'vblk1',
        type: 'PLACE_INFO',
        title: 'Venue Info',
        enabled: true,
        order: 1,
        config: {
          address: '12-2 Wausan-ro, Mapo-gu, Seoul',
          mapUrl: 'https://maps.google.com',
          contact: 'contact@moonlight.example'
        }
      },
      {
        id: 'vblk2',
        type: 'EVENTS',
        title: 'This Month',
        enabled: true,
        order: 2,
        config: {}
      }
    ],
    events: [
      {
        id: 'evt3',
        title: 'Open Mic Thursday',
        startsAt: '2026-03-07T20:00:00+09:00',
        venueName: 'Moonlight Hall'
      },
      {
        id: 'evt4',
        title: 'Noise & Dreams',
        startsAt: '2026-03-21T20:00:00+09:00',
        venueName: 'Moonlight Hall'
      }
    ]
  }
];

export function listProfiles(): PublicProfile[] {
  return profiles.map((profile) => ({ ...profile }));
}

export function getProfileByHandle(rawHandle: string): PublicProfile | null {
  const handle = normalizeHandle(rawHandle);
  const profile = profiles.find((candidate) => candidate.handle === handle);

  return profile ? { ...profile } : null;
}

export function getProfileById(profileId: string): PublicProfile | null {
  const profile = profiles.find((candidate) => candidate.id === profileId);

  return profile ? { ...profile } : null;
}

export function getEvents(params: {
  artistId?: string;
  placeId?: string;
  from?: string;
}): TrappistEvent[] {
  const allEvents = profiles.flatMap((profile) => profile.events);

  const filteredByEntity = allEvents.filter((event) => {
    if (!params.artistId && !params.placeId) return true;

    const fromArtist = params.artistId
      ? profiles.some(
          (profile) =>
            profile.connectedTrappistArtistId === params.artistId &&
            profile.events.some((candidate) => candidate.id === event.id)
        )
      : false;

    const fromPlace = params.placeId
      ? profiles.some(
          (profile) =>
            profile.connectedTrappistPlaceId === params.placeId &&
            profile.events.some((candidate) => candidate.id === event.id)
        )
      : false;

    return fromArtist || fromPlace;
  });

  const fromDate = params.from ? new Date(params.from).getTime() : Number.NEGATIVE_INFINITY;

  return filteredByEntity
    .filter((event) => new Date(event.startsAt).getTime() >= fromDate)
    .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
}
