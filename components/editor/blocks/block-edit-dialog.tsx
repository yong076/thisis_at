'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import type { ProfileBlock, BlockType } from '@/lib/types';
import { getBlockMeta } from '@/lib/block-configs';
import { useT } from '@/lib/i18n/client';
import { LinkButtonForm } from './forms/link-button-form';
import { TextAnnouncementForm } from './forms/text-announcement-form';
import { SocialRowForm } from './forms/social-row-form';
import { PlaceInfoForm } from './forms/place-info-form';
import { EmbedForm } from './forms/embed-form';
import { InstagramEmbedForm } from './forms/instagram-embed-form';
import { FaqForm } from './forms/faq-form';
import { BusinessHoursForm } from './forms/business-hours-form';
import { RichTextForm } from './forms/rich-text-form';
import { TeamMembersForm } from './forms/team-members-form';
import { TicketCtaForm } from './forms/ticket-cta-form';
import { ProductCardsForm } from './forms/product-cards-form';

type Props = {
  open: boolean;
  block: ProfileBlock | null;
  /** For new block creation, pass the type */
  newBlockType?: BlockType;
  handle: string;
  onClose: () => void;
  onSaved: (block: ProfileBlock) => void;
};

export type BlockFormProps = {
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
};

function getFormComponent(type: BlockType) {
  switch (type) {
    case 'LINK_BUTTON': return LinkButtonForm;
    case 'TEXT_ANNOUNCEMENT': return TextAnnouncementForm;
    case 'SOCIAL_ROW': return SocialRowForm;
    case 'PLACE_INFO': return PlaceInfoForm;
    case 'EMBED': return EmbedForm;
    case 'INSTAGRAM_EMBED': return InstagramEmbedForm;
    case 'FAQ': return FaqForm;
    case 'BUSINESS_HOURS': return BusinessHoursForm;
    case 'RICH_TEXT': return RichTextForm;
    case 'TEAM_MEMBERS': return TeamMembersForm;
    case 'TICKET_CTA': return TicketCtaForm;
    case 'PRODUCT_CARDS': return ProductCardsForm;
    default: return null;
  }
}

export function BlockEditDialog({ open, block, newBlockType, handle, onClose, onSaved }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [config, setConfig] = useState<Record<string, unknown>>({});

  const blockType = block?.type ?? newBlockType;
  const isNew = !block;
  const meta = blockType ? getBlockMeta(blockType) : null;
  const FormComponent = blockType ? getFormComponent(blockType) : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (open) {
      setTitle(block?.title ?? '');
      setConfig(block?.config ?? meta?.defaultConfig ?? {});
      setError('');
    }
  }, [open, block, meta]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      onClose();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    startTransition(async () => {
      try {
        let res: Response;

        if (isNew && blockType) {
          // Create new block
          res = await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: blockType,
              title: title.trim() || null,
              config,
            }),
          });
        } else if (block) {
          // Update existing block
          res = await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks/${block.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: title.trim() || null,
              config,
            }),
          });
        } else {
          return;
        }

        const data = await res.json();

        if (!res.ok) {
          setError(data.error ?? t('common.error.save'));
          return;
        }

        onSaved(data.block);
        onClose();
      } catch {
        setError(t('common.error.network'));
      }
    });
  }

  return (
    <dialog ref={dialogRef} className="block-dialog block-edit-dialog" onClick={handleBackdropClick} onClose={onClose}>
      <div className="dialog-content">
        <div className="dialog-header">
          <h2>
            <span className="gradient-text">
              {meta?.icon} {isNew ? t('blocks.newBlock') : t('blocks.editTitle')}: {blockType ? t(`blockType.${blockType}`) : ''}
            </span>
          </h2>
          <button className="dialog-close" onClick={onClose} type="button">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Block Title */}
          <div className="form-group">
            <label htmlFor="block-title">{t('blocks.blockTitleLabel')}</label>
            <input
              id="block-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('blocks.blockTitlePlaceholder')}
              maxLength={100}
            />
          </div>

          {/* Block Config Form */}
          {FormComponent && (
            <FormComponent config={config} onChange={setConfig} />
          )}

          {/* Error */}
          {error && <div className="form-error">{error}</div>}

          {/* Actions */}
          <div className="dialog-actions">
            <button type="button" className="button-secondary" onClick={onClose}>
              {t('common.cancel')}
            </button>
            <button type="submit" className="button-primary" disabled={isPending}>
              {isPending ? t('common.saving') : isNew ? t('blocks.submit.add') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
