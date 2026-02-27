import { normalizeHandle } from '@/lib/handle';
import type { PublicProfile, TrappistEvent } from '@/lib/types';

const profiles: PublicProfile[] = [
  {
    id: 'profile-band-lucid',
    handle: 'lucid.band',
    displayName: 'LUCID BAND',
    type: 'ARTIST',
    bio: '서울 기반 올트팝 밴드. 새 싱글 발매. 매달 라이브.',
    location: '서울, 대한민국',
    avatarUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=480&q=80',
    coverUrl:
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80',
    connectedTrappistArtistId: 'artist_lucid_001',
    customization: {
      themeId: 'radiant',
      fontBody: 'pretendard',
      fontDisplay: 'fraunces',
      showSparkles: true,
      buttonStyle: 'gradient',
      profileLayout: 'centered',
    },
    blocks: [
      {
        id: 'blk1',
        type: 'TEXT_ANNOUNCEMENT',
        title: '공지',
        enabled: true,
        order: 1,
        config: {
          text: '3월 15일 쇼케이스 티켓 오픈. 선착순 한정 굿즈 포함.'
        }
      },
      {
        id: 'blk2',
        type: 'LINK_BUTTON',
        title: '신곡 듣기',
        enabled: true,
        order: 2,
        config: {
          label: 'Spotify에서 듣기',
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
        title: '다가오는 공연',
        enabled: true,
        order: 4,
        config: {}
      },
      {
        id: 'blk5',
        type: 'MEDIA_GALLERY',
        title: '갤러리',
        enabled: true,
        order: 5,
        config: {
          images: [
            'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=600&q=80',
            'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&q=80'
          ]
        }
      },
      {
        id: 'blk6',
        type: 'INSTAGRAM_EMBED',
        title: 'Instagram',
        enabled: true,
        order: 6,
        config: {
          postUrl: 'https://www.instagram.com/p/C1JfEJ_JAZM/',
          caption: '최근 공연 현장'
        }
      }
    ],
    events: [
      {
        id: 'evt1',
        title: 'LUCID 쇼케이스',
        startsAt: '2026-03-15T19:00:00+09:00',
        venueName: 'Moonlight Hall',
        ticketUrl: 'https://example.com/tickets/lucid-showcase'
      },
      {
        id: 'evt2',
        title: '시티 나이트 페스트',
        startsAt: '2026-03-29T20:00:00+09:00',
        venueName: '한강 스테이지',
        ticketUrl: 'https://example.com/tickets/city-night-fest'
      }
    ]
  },
  {
    id: 'profile-venue-moonlight',
    handle: 'moonlight_hall',
    displayName: 'Moonlight Hall',
    type: 'VENUE',
    bio: '인디, 포스트록, 실험 음악을 위한 라이브 하우스.',
    location: '마포구, 서울',
    avatarUrl:
      'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?auto=format&fit=crop&w=480&q=80',
    connectedTrappistPlaceId: 'place_moonlight_001',
    customization: {
      themeId: 'midnight-neon',
      fontBody: 'noto-sans-kr',
      fontDisplay: 'space-grotesk',
      showSparkles: true,
      buttonStyle: 'gradient',
      profileLayout: 'centered',
    },
    blocks: [
      {
        id: 'vblk1',
        type: 'PLACE_INFO',
        title: '공연장 정보',
        enabled: true,
        order: 1,
        config: {
          address: '서울시 마포구 와우산로 12-2',
          mapUrl: 'https://maps.google.com',
          contact: 'contact@moonlight.example'
        }
      },
      {
        id: 'vblk2',
        type: 'EVENTS',
        title: '이번 달 공연',
        enabled: true,
        order: 2,
        config: {}
      }
    ],
    events: [
      {
        id: 'evt3',
        title: '오픈 마이크 목요일',
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
