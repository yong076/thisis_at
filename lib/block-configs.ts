import type { BlockType, ProfileType } from './types';

export type BlockMeta = {
  type: BlockType;
  labelKo: string;
  descriptionKo: string;
  icon: string;
  relevantTypes: ProfileType[] | 'all';
  defaultConfig: Record<string, unknown>;
};

export const BLOCK_REGISTRY: BlockMeta[] = [
  {
    type: 'LINK_BUTTON',
    labelKo: '링크 버튼',
    descriptionKo: '외부 링크 버튼을 추가합니다',
    icon: '🔗',
    relevantTypes: 'all',
    defaultConfig: { label: '', url: '' },
  },
  {
    type: 'TEXT_ANNOUNCEMENT',
    labelKo: '공지/텍스트',
    descriptionKo: '공지사항이나 짧은 텍스트를 표시합니다',
    icon: '📢',
    relevantTypes: 'all',
    defaultConfig: { text: '' },
  },
  {
    type: 'SOCIAL_ROW',
    labelKo: '소셜 링크',
    descriptionKo: 'SNS 링크 버튼 모음',
    icon: '💬',
    relevantTypes: 'all',
    defaultConfig: { links: [] },
  },
  {
    type: 'MEDIA_GALLERY',
    labelKo: '갤러리',
    descriptionKo: '이미지 갤러리를 추가합니다',
    icon: '🖼️',
    relevantTypes: 'all',
    defaultConfig: { images: [] },
  },
  {
    type: 'EMBED',
    labelKo: '임베드',
    descriptionKo: '외부 콘텐츠를 임베드합니다',
    icon: '📎',
    relevantTypes: 'all',
    defaultConfig: { provider: '', url: '' },
  },
  {
    type: 'INSTAGRAM_EMBED',
    labelKo: '인스타그램',
    descriptionKo: '인스타그램 게시물을 임베드합니다',
    icon: '📸',
    relevantTypes: 'all',
    defaultConfig: { postUrl: '' },
  },
  {
    type: 'EVENTS',
    labelKo: '이벤트/공연',
    descriptionKo: '다가오는 이벤트 목록을 표시합니다',
    icon: '🎤',
    relevantTypes: ['ARTIST', 'VENUE', 'ORGANIZATION'],
    defaultConfig: {},
  },
  {
    type: 'PLACE_INFO',
    labelKo: '위치 정보',
    descriptionKo: '주소, 연락처, 지도 링크',
    icon: '📍',
    relevantTypes: ['VENUE', 'RESTAURANT', 'BUSINESS', 'ORGANIZATION'],
    defaultConfig: { address: '', mapUrl: '', contact: '' },
  },
  {
    type: 'FAQ',
    labelKo: '자주 묻는 질문',
    descriptionKo: 'Q&A 목록을 추가합니다',
    icon: '❓',
    relevantTypes: 'all',
    defaultConfig: { items: [] },
  },
  {
    type: 'BUSINESS_HOURS',
    labelKo: '영업시간',
    descriptionKo: '요일별 영업시간을 표시합니다',
    icon: '🕐',
    relevantTypes: ['VENUE', 'RESTAURANT', 'BUSINESS'],
    defaultConfig: {
      schedule: [
        { day: '월', open: '09:00', close: '18:00', closed: false },
        { day: '화', open: '09:00', close: '18:00', closed: false },
        { day: '수', open: '09:00', close: '18:00', closed: false },
        { day: '목', open: '09:00', close: '18:00', closed: false },
        { day: '금', open: '09:00', close: '18:00', closed: false },
        { day: '토', open: '10:00', close: '15:00', closed: false },
        { day: '일', open: '', close: '', closed: true },
      ],
    },
  },
  {
    type: 'RICH_TEXT',
    labelKo: '서식 텍스트',
    descriptionKo: '자유 형식의 텍스트 블록',
    icon: '📝',
    relevantTypes: 'all',
    defaultConfig: { html: '' },
  },
  {
    type: 'TEAM_MEMBERS',
    labelKo: '팀 소개',
    descriptionKo: '팀원을 소개합니다',
    icon: '👥',
    relevantTypes: ['BUSINESS', 'ORGANIZATION', 'VENUE'],
    defaultConfig: { members: [] },
  },
  {
    type: 'TICKET_CTA',
    labelKo: '티켓/예매',
    descriptionKo: '티켓 구매 버튼을 추가합니다',
    icon: '🎫',
    relevantTypes: ['ARTIST', 'VENUE', 'ORGANIZATION'],
    defaultConfig: { label: '예매하기', url: '' },
  },
  {
    type: 'PRODUCT_CARDS',
    labelKo: '상품 카드',
    descriptionKo: '상품 목록을 카드로 표시합니다',
    icon: '🛍️',
    relevantTypes: ['BUSINESS', 'RESTAURANT', 'CREATOR', 'INFLUENCER'],
    defaultConfig: { products: [] },
  },
];

export function getBlockMeta(type: BlockType): BlockMeta | undefined {
  return BLOCK_REGISTRY.find((b) => b.type === type);
}

export function getBlocksForProfileType(profileType: ProfileType): BlockMeta[] {
  return BLOCK_REGISTRY.filter(
    (b) => b.relevantTypes === 'all' || b.relevantTypes.includes(profileType),
  );
}
