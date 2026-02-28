export type ProfileType =
  | 'ARTIST'
  | 'VENUE'
  | 'CREATOR'
  | 'BUSINESS'
  | 'INFLUENCER'
  | 'PERSONAL'
  | 'RESTAURANT'
  | 'ORGANIZATION';

export type BlockType =
  | 'LINK_BUTTON'
  | 'SOCIAL_ROW'
  | 'EMBED'
  | 'TEXT_ANNOUNCEMENT'
  | 'MEDIA_GALLERY'
  | 'EVENTS'
  | 'PLACE_INFO'
  | 'TICKET_CTA'
  | 'PRODUCT_CARDS'
  | 'INSTAGRAM_EMBED'
  | 'FAQ'
  | 'BUSINESS_HOURS'
  | 'RICH_TEXT'
  | 'TEAM_MEMBERS';

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

export type ProfileCustomization = {
  themeId: string;
  fontBody: string;
  fontDisplay: string;
  customAccentColor?: string;
  buttonStyle?: 'gradient' | 'solid' | 'outline' | 'glass';
  cardStyle?: 'glass' | 'solid' | 'border-only' | 'shadow';
  showSparkles?: boolean;
  profileLayout?: 'centered' | 'left-aligned';
};

export type ProfileCategory = {
  slug: string;
  nameKo: string;
  icon?: string;
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
  category?: ProfileCategory;
  blocks: ProfileBlock[];
  events: TrappistEvent[];
  showVisitorCount?: boolean;
  customization?: ProfileCustomization;
};
