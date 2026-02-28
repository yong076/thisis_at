import Image from 'next/image';
import type { ProfileBlock, TrappistEvent } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import { detectPlatform } from '@/lib/social-icons';
import { InstagramEmbed } from '@/components/public/instagram-embed';

type TFunc = (key: string, params?: Record<string, string | number>) => string;

export function renderBlockContent(block: ProfileBlock, events: TrappistEvent[], t: TFunc) {
  if (!block.enabled) return null;

  switch (block.type) {
    case 'TEXT_ANNOUNCEMENT': {
      const text = (block.config.text as string | undefined) ?? '';
      return (
        <article className="block-notice">
          <h3>{block.title ?? t('block.notice')}</h3>
          <p className="notice-text">{text}</p>
        </article>
      );
    }

    case 'LINK_BUTTON': {
      const label = (block.config.label as string | undefined) ?? t('block.openLink');
      const url = (block.config.url as string | undefined) ?? '#';
      return (
        <article>
          <a href={url} className="button-link" target="_blank" rel="noreferrer noopener">
            <span>{label}</span>
          </a>
        </article>
      );
    }

    case 'SOCIAL_ROW': {
      const links = (block.config.links as { label: string; url: string }[] | undefined) ?? [];
      return (
        <article className="block" style={{ textAlign: 'center' }}>
          <h3>{block.title ?? t('block.follow')}</h3>
          <div className="social-row">
            {links.map((link) => {
              const platform = detectPlatform(link.url, link.label);
              return (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="social-chip"
                >
                  <svg className="social-icon" viewBox={platform.viewBox} fill="currentColor" aria-hidden="true">
                    <path d={platform.path} />
                  </svg>
                  <span>{link.label}</span>
                </a>
              );
            })}
          </div>
        </article>
      );
    }

    case 'MEDIA_GALLERY': {
      const images = (block.config.images as string[] | undefined) ?? [];
      const galleryMod =
        images.length === 1 ? 'gallery--single' : images.length === 3 ? 'gallery--three' : '';
      return (
        <article className="block">
          <h3>{block.title ?? t('block.gallery')}</h3>
          <div className={`gallery ${galleryMod}`}>
            {images.map((image, idx) => (
              <div key={`${image}-${idx}`} className="gallery-item">
                <Image
                  src={image}
                  alt={t('block.media')}
                  fill
                  sizes="(max-width: 720px) 50vw, 240px"
                />
              </div>
            ))}
          </div>
        </article>
      );
    }

    case 'EVENTS': {
      return (
        <article className="block">
          <h3>{block.title ?? t('block.upcomingEvents')}</h3>
          <div className="event-list">
            {events.length === 0 ? <p className="subtitle">{t('block.noEvents')}</p> : null}
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
                    {t('block.ticket')}
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
          <h3>{block.title ?? t('block.location')}</h3>
          <p style={{ margin: '0 0 0.3rem', fontSize: '0.92rem' }}>{address}</p>
          <p className="subtitle" style={{ marginBottom: '0.8rem' }}>{contact}</p>
          {mapUrl ? (
            <a href={mapUrl} target="_blank" rel="noreferrer noopener" className="button-link">
              <span>{t('block.openMap')}</span>
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
            <span>{provider} {t('block.open')}</span>
          </a>
        </article>
      );
    }

    case 'INSTAGRAM_EMBED': {
      const postUrl = (block.config.postUrl as string | undefined) ?? '';
      const caption = (block.config.caption as string | undefined) ?? undefined;
      return (
        <article className="block">
          <h3>{block.title ?? 'Instagram'}</h3>
          {postUrl ? (
            <InstagramEmbed postUrl={postUrl} caption={caption} />
          ) : (
            <p className="subtitle">{t('block.instagramNotSet')}</p>
          )}
        </article>
      );
    }

    case 'FAQ': {
      const items = (block.config.items as { question: string; answer: string }[] | undefined) ?? [];
      return (
        <article className="block">
          <h3>{block.title ?? t('block.faq')}</h3>
          <div className="faq-list">
            {items.map((item, idx) => (
              <details key={idx} className="faq-item">
                <summary className="faq-question">
                  <span>{item.question}</span>
                  <svg className="faq-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </summary>
                <div className="faq-content">
                  <div className="faq-content-inner">
                    <p className="faq-answer">{item.answer}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </article>
      );
    }

    case 'BUSINESS_HOURS': {
      const schedule = (block.config.schedule as { day: string; open: string; close: string; closed?: boolean }[] | undefined) ?? [];
      return (
        <article className="block">
          <h3>{block.title ?? t('block.businessHours')}</h3>
          <div className="hours-list">
            {schedule.map((s, idx) => (
              <div key={idx} className="hours-row">
                <span className="hours-day">{s.day}</span>
                <span className="hours-time">
                  {s.closed ? t('block.closed') : `${s.open} – ${s.close}`}
                </span>
              </div>
            ))}
          </div>
        </article>
      );
    }

    case 'RICH_TEXT': {
      const html = (block.config.html as string | undefined) ?? '';
      return (
        <article className="block">
          {block.title && <h3>{block.title}</h3>}
          <div className="rich-text" dangerouslySetInnerHTML={{ __html: html }} />
        </article>
      );
    }

    case 'TEAM_MEMBERS': {
      const members = (block.config.members as { name: string; role?: string; imageUrl?: string; url?: string }[] | undefined) ?? [];
      return (
        <article className="block">
          <h3>{block.title ?? t('block.team')}</h3>
          <div className="team-grid">
            {members.map((member, idx) => (
              <div key={idx} className="team-member">
                {member.imageUrl ? (
                  <Image src={member.imageUrl} alt={member.name} width={48} height={48} className="team-avatar" />
                ) : (
                  <div className="team-avatar team-avatar--placeholder">{member.name.charAt(0)}</div>
                )}
                <strong className="team-name">{member.name}</strong>
                {member.role && <small className="team-role">{member.role}</small>}
              </div>
            ))}
          </div>
        </article>
      );
    }

    case 'TICKET_CTA': {
      const label = (block.config.label as string | undefined) ?? t('block.buyTicket');
      const url = (block.config.url as string | undefined) ?? '#';
      const price = (block.config.price as string | undefined);
      return (
        <article>
          <a href={url} className="button-link button-link--cta" target="_blank" rel="noreferrer noopener">
            <span>{label}</span>
            {price && <small style={{ opacity: 0.8 }}>{price}</small>}
          </a>
        </article>
      );
    }

    case 'PRODUCT_CARDS': {
      const products = (block.config.products as { name: string; price: string; description?: string; imageUrl?: string; url?: string }[] | undefined) ?? [];
      return (
        <article className="block">
          <h3>{block.title ?? t('block.products')}</h3>
          <div className="product-grid">
            {products.map((product, idx) => (
              <div key={idx} className="product-card">
                {product.imageUrl && (
                  <div className="product-image">
                    <Image src={product.imageUrl} alt={product.name} fill sizes="160px" />
                  </div>
                )}
                <div className="product-info">
                  <strong>{product.name}</strong>
                  <span className="product-price">{product.price}</span>
                  {product.description && <small>{product.description}</small>}
                </div>
                {product.url && (
                  <a href={product.url} target="_blank" rel="noreferrer noopener" className="product-link">
                    {t('block.view')}
                  </a>
                )}
              </div>
            ))}
          </div>
        </article>
      );
    }

    default:
      return null;
  }
}
