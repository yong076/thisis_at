import Image from 'next/image';
import type { ProfileBlock, TrappistEvent } from '@/lib/types';
import { formatDateTime } from '@/lib/format';

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
        <article className="block">
          <h3>{block.title ?? 'Announcement'}</h3>
          <p className="notice">{text}</p>
        </article>
      );
    }

    case 'LINK_BUTTON': {
      const label = (block.config.label as string | undefined) ?? 'Open link';
      const url = (block.config.url as string | undefined) ?? '#';
      return (
        <article className="block">
          {block.title ? <h3>{block.title}</h3> : null}
          <a href={url} className="button-link" target="_blank" rel="noreferrer noopener">
            {label}
          </a>
        </article>
      );
    }

    case 'SOCIAL_ROW': {
      const links = (block.config.links as { label: string; url: string }[] | undefined) ?? [];
      return (
        <article className="block">
          <h3>{block.title ?? 'Social'}</h3>
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
        <article className="block">
          <h3>{block.title ?? 'Gallery'}</h3>
          <div className="gallery">
            {images.map((image, idx) => (
              <Image key={`${image}-${idx}`} src={image} alt="profile media" width={600} height={600} />
            ))}
          </div>
        </article>
      );
    }

    case 'EVENTS': {
      return (
        <article className="block">
          <h3>{block.title ?? 'Upcoming Events'}</h3>
          <div className="event-list">
            {events.length === 0 ? <p className="subtitle">No upcoming events.</p> : null}
            {events.map((event) => (
              <div className="event-item" key={event.id}>
                <div>
                  <strong>{event.title}</strong>
                  <br />
                  <small>
                    {event.venueName} • {formatDateTime(event.startsAt)}
                  </small>
                </div>
                {event.ticketUrl ? (
                  <a href={event.ticketUrl} target="_blank" rel="noreferrer noopener" className="event-link">
                    Ticket
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
        <article className="block">
          <h3>{block.title ?? 'Place Info'}</h3>
          <p>{address}</p>
          <p className="subtitle">{contact}</p>
          {mapUrl ? (
            <a href={mapUrl} target="_blank" rel="noreferrer noopener" className="button-link">
              Open Map
            </a>
          ) : null}
        </article>
      );
    }

    case 'EMBED': {
      const provider = (block.config.provider as string | undefined) ?? 'Embed';
      const url = (block.config.url as string | undefined) ?? '#';
      return (
        <article className="block">
          <h3>{block.title ?? provider}</h3>
          <a href={url} target="_blank" rel="noreferrer noopener" className="button-link">
            Open {provider}
          </a>
        </article>
      );
    }

    default:
      return null;
  }
}
