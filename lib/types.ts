export type ProfileType = 'ARTIST' | 'VENUE' | 'CREATOR';

export type BlockType =
  | 'LINK_BUTTON'
  | 'SOCIAL_ROW'
  | 'EMBED'
  | 'TEXT_ANNOUNCEMENT'
  | 'MEDIA_GALLERY'
  | 'EVENTS'
  | 'PLACE_INFO';

export type ProfileBlock = {
  id: string;
  type: BlockType;
  title?: string;
  enabled: boolean;
  order: number;
  config: Record<string, unknown>;
};

export type TrappistEvent = {
  id: string;
  title: string;
  startsAt: string;
  venueName: string;
  ticketUrl?: string;
};

export type PublicProfile = {
  id: string;
  handle: string;
  displayName: string;
  type: ProfileType;
  bio: string;
  location?: string;
  avatarUrl?: string;
  coverUrl?: string;
  connectedTrappistArtistId?: string;
  connectedTrappistPlaceId?: string;
  blocks: ProfileBlock[];
  events: TrappistEvent[];
};
