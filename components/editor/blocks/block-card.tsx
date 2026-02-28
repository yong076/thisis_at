'use client';

import { useState, useTransition } from 'react';
import type { ProfileBlock } from '@/lib/types';
import { getBlockMeta } from '@/lib/block-configs';

type Props = {
  block: ProfileBlock;
  handle: string;
  onEdit: (block: ProfileBlock) => void;
  onDelete: (blockId: string) => void;
  onToggle: (blockId: string, enabled: boolean) => void;
  dragHandleProps?: Record<string, unknown>;
};

export function BlockCard({ block, handle, onEdit, onDelete, onToggle, dragHandleProps }: Props) {
  const meta = getBlockMeta(block.type);
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleToggle() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks/${block.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled: !block.enabled }),
        });
        if (res.ok) {
          onToggle(block.id, !block.enabled);
        }
      } catch {
        // silently ignore
      }
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks/${block.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          onDelete(block.id);
        }
      } catch {
        // silently ignore
      }
    });
  }

  return (
    <div className={`block-card ${!block.enabled ? 'block-card--disabled' : ''}`}>
      <div className="block-card-header">
        <div className="block-card-left">
          <button className="block-card-drag" type="button" {...dragHandleProps}>
            ⠿
          </button>
          <span className="block-card-icon">{meta?.icon ?? '📦'}</span>
          <div className="block-card-info">
            <span className="block-card-title">{block.title || meta?.labelKo || block.type}</span>
            <span className="block-card-type">{meta?.labelKo ?? block.type}</span>
          </div>
        </div>
        <div className="block-card-actions">
          <label className="block-card-toggle" title={block.enabled ? '비활성화' : '활성화'}>
            <input
              type="checkbox"
              checked={block.enabled}
              onChange={handleToggle}
              disabled={isPending}
            />
            <span className="block-card-toggle-slider" />
          </label>
          <button
            className="block-card-btn"
            onClick={() => onEdit(block)}
            disabled={isPending}
            type="button"
            title="편집"
          >
            ✏️
          </button>
          <button
            className={`block-card-btn block-card-btn--delete ${confirmDelete ? 'block-card-btn--confirm' : ''}`}
            onClick={handleDelete}
            disabled={isPending}
            type="button"
            title={confirmDelete ? '정말 삭제?' : '삭제'}
          >
            {confirmDelete ? '확인?' : '🗑️'}
          </button>
        </div>
      </div>
    </div>
  );
}
