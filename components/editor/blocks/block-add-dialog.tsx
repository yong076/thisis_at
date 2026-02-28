'use client';

import { useEffect, useRef } from 'react';
import type { BlockType, ProfileType } from '@/lib/types';
import { getBlocksForProfileType, type BlockMeta } from '@/lib/block-configs';
import { useT } from '@/lib/i18n/client';

type Props = {
  open: boolean;
  profileType: ProfileType;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
};

export function BlockAddDialog({ open, profileType, onClose, onSelect }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const blocks = getBlocksForProfileType(profileType);
  const t = useT();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    const rect = dialogRef.current?.getBoundingClientRect();
    if (!rect) return;
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      onClose();
    }
  }

  function handleSelect(meta: BlockMeta) {
    onSelect(meta.type);
    onClose();
  }

  return (
    <dialog ref={dialogRef} className="block-dialog" onClick={handleBackdropClick} onClose={onClose}>
      <div className="dialog-content">
        <div className="dialog-header">
          <h2><span className="gradient-text">{t('blocks.addTitle')}</span></h2>
          <button className="dialog-close" onClick={onClose} type="button">✕</button>
        </div>
        <div className="block-type-grid">
          {blocks.map((meta) => (
            <button
              key={meta.type}
              className="block-type-option"
              onClick={() => handleSelect(meta)}
              type="button"
            >
              <span className="block-type-icon">{meta.icon}</span>
              <strong>{t(`blockType.${meta.type}`)}</strong>
              <small>{t(`blockTypeDesc.${meta.type}`)}</small>
            </button>
          ))}
        </div>
      </div>
    </dialog>
  );
}
