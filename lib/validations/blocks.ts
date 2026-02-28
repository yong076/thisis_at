import { z } from 'zod';
import type { BlockType } from '../types';

export const linkButtonSchema = z.object({
  label: z.string().min(1, '라벨을 입력하세요').max(100),
  url: z.string().url('올바른 URL을 입력하세요'),
  icon: z.string().optional(),
});

export const textAnnouncementSchema = z.object({
  text: z.string().min(1, '텍스트를 입력하세요').max(2000),
});

export const socialRowSchema = z.object({
  links: z
    .array(
      z.object({
        label: z.string().min(1),
        url: z.string().url(),
        platform: z.string().optional(),
      }),
    )
    .min(1, '최소 1개의 링크가 필요합니다')
    .max(20),
});

export const mediaGallerySchema = z.object({
  images: z.array(z.string().url()).min(1, '최소 1개의 이미지가 필요합니다').max(20),
});

export const embedSchema = z.object({
  provider: z.string().min(1, '제공자를 입력하세요'),
  url: z.string().url('올바른 URL을 입력하세요'),
});

export const instagramEmbedSchema = z.object({
  postUrl: z.string().url('올바른 Instagram URL을 입력하세요'),
  caption: z.string().optional(),
});

export const eventsSchema = z.object({});

export const placeInfoSchema = z.object({
  address: z.string().min(1, '주소를 입력하세요'),
  mapUrl: z.string().url().optional().or(z.literal('')),
  contact: z.string().optional(),
});

export const faqSchema = z.object({
  items: z
    .array(
      z.object({
        question: z.string().min(1, '질문을 입력하세요'),
        answer: z.string().min(1, '답변을 입력하세요'),
      }),
    )
    .min(1, '최소 1개의 Q&A가 필요합니다'),
});

export const businessHoursSchema = z.object({
  schedule: z.array(
    z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
      closed: z.boolean().optional(),
    }),
  ),
});

export const richTextSchema = z.object({
  html: z.string().min(1, '텍스트를 입력하세요').max(10000),
});

export const teamMembersSchema = z.object({
  members: z
    .array(
      z.object({
        name: z.string().min(1),
        role: z.string().optional(),
        imageUrl: z.string().url().optional().or(z.literal('')),
        url: z.string().url().optional().or(z.literal('')),
      }),
    )
    .min(1, '최소 1명의 팀원이 필요합니다'),
});

export const ticketCtaSchema = z.object({
  label: z.string().min(1, '라벨을 입력하세요'),
  url: z.string().url('올바른 URL을 입력하세요'),
  price: z.string().optional(),
});

export const productCardsSchema = z.object({
  products: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.string().min(1),
        description: z.string().optional(),
        imageUrl: z.string().url().optional().or(z.literal('')),
        url: z.string().url().optional().or(z.literal('')),
      }),
    )
    .min(1, '최소 1개의 상품이 필요합니다'),
});

export const blockConfigSchemas: Record<BlockType, z.ZodSchema> = {
  LINK_BUTTON: linkButtonSchema,
  TEXT_ANNOUNCEMENT: textAnnouncementSchema,
  SOCIAL_ROW: socialRowSchema,
  MEDIA_GALLERY: mediaGallerySchema,
  EMBED: embedSchema,
  INSTAGRAM_EMBED: instagramEmbedSchema,
  EVENTS: eventsSchema,
  PLACE_INFO: placeInfoSchema,
  FAQ: faqSchema,
  BUSINESS_HOURS: businessHoursSchema,
  RICH_TEXT: richTextSchema,
  TEAM_MEMBERS: teamMembersSchema,
  TICKET_CTA: ticketCtaSchema,
  PRODUCT_CARDS: productCardsSchema,
};

export function validateBlockConfig(type: BlockType, config: unknown) {
  const schema = blockConfigSchemas[type];
  if (!schema) return { success: false as const, error: '알 수 없는 블록 타입입니다.' };
  const result = schema.safeParse(config);
  if (!result.success) {
    return { success: false as const, error: result.error.issues[0]?.message ?? '유효하지 않은 설정입니다.' };
  }
  return { success: true as const, data: result.data };
}
