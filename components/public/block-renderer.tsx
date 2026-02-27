import Image from 'next/image';
import type { ProfileBlock, TrappistEvent } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { InstagramEmbed } from './instagram-embed';

type Props = {
  block: ProfileBlock;
  events: TrappistEvent[];
};

export function BlockRenderer({ block, events }: Props) {
  if (!block.enabled) return null;

  switch (block.type) {
    case 'TEXT_ANNOUNCEMENT': {
      const text = (block.config.text as string | undefined) ?? '';
      return (
        <article className="block-notice animate-fade-up">
          <h3>{block.title ?? '공지'}</h3>
          <p className="notice-text">{text}</p>
        </article>
      );
    }

    case 'LINK_BUTTON': {
      const label = (block.config.label as string | undefined) ?? '링크 열기';
      const url = (block.config.url as string | undefined) ?? '#';
      return (
        <article className="animate-fade-up">
          <a href={url} className="button-link" target="_blank" rel="noreferrer noopener">
            <span>{label}</span>
          </a>
        </article>
      );
    }

    case 'SOCIAL_ROW': {
      const links = (block.config.links as { label: string; url: string }[] | undefined) ?? [];
      return (
        <article className="block animate-fade-up" style={{ textAlign: 'center' }}>
          <h3>{block.title ?? '팔로우'}</h3>
          <div className="social-row">
            {links.map((link) => (
              <a
                key={`${link.label}-${link.url}`}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
                className="social-chip"
              >
                {link.label}
              </a>
            ))}
          </div>
        </article>
      );
    }

    case 'MEDIA_GALLERY': {
      const images = (block.config.images as string[] | undefined) ?? [];
      return (
        <article className="block animate-fade-up">
          <h3>{block.title ?? '갤러리'}</h3>
          <div className="gallery">
            {images.map((image, idx) => (
              <Image key={`${image}-${idx}`} src={image} alt="미디어" width={600} height={600} />
            ))}
          </div>
        </article>
      );
    }

    case 'EVENTS': {
      return (
        <article className="block animate-fade-up">
          <h3>{block.title ?? '다가오는 공연'}</h3>
          <div className="event-list">
            {events.length === 0 ? <p className="subtitle">예정된 공연이 없습니다.</p> : null}
            {events.map((event) => (
              <div className="event-item" key={event.id}>
                <div>
                  <strong>{event.title}</strong>
                  <br />
                  <small>
                    {event.venueName} &middot; {formatDateTime(event.startsAt)}
                  </small>
                </div>
                {event.ticketUrl ? (
                  <a href={event.ticketUrl} target="_blank" rel="noreferrer noopener" className="event-link">
                    예매
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </article>
      );
    }

    case 'PLACE_INFO': {
      const address = (block.config.address as string | undefined) ?? '';
      const mapUrl = (block.config.mapUrl as string | undefined) ?? '';
      const contact = (block.config.contact as string | undefined) ?? '';
      return (
        <article className="block animate-fade-up">
          <h3>{block.title ?? '위치'}</h3>
          <p style={{ margin: '0 0 0.3rem', fontSize: '0.92rem' }}>{address}</p>
          <p className="subtitle" style={{ marginBottom: '0.8rem' }}>{contact}</p>
          {mapUrl ? (
            <a href={mapUrl} target="_blank" rel="noreferrer noopener" className="button-link">
              <span>지도 열기</span>
            </a>
          ) : null}
        </article>
      );
    }

    case 'EMBED': {
      const provider = (block.config.provider as string | undefined) ?? 'Embed';
      const url = (block.config.url as string | undefined) ?? '#';
      return (
        <article className="block animate-fade-up">
          <h3>{block.title ?? provider}</h3>
          <a href={url} target="_blank" rel="noreferrer noopener" className="button-link">
            <span>{provider} 열기</span>
          </a>
        </article>
      );
    }

    case 'INSTAGRAM_EMBED': {
      const postUrl = (block.config.postUrl as string | undefined) ?? '';
      const caption = (block.config.caption as string | undefined) ?? undefined;
      return (
        <article className="block animate-fade-up">
          <h3>{block.title ?? 'Instagram'}</h3>
          {postUrl ? (
            <InstagramEmbed postUrl={postUrl} caption={caption} />
          ) : (
            <p className="subtitle">인스타그램 URL이 설정되지 않았습니다.</p>
          )}
        </article>
      );
    }

    default:
      return null;
  }
}
