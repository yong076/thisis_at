'use client';

import { useState, useTransition } from 'react';
import type { ProfileBlock } from '@/lib/types';
import { getBlockMeta } from '@/lib/block-configs';
import { useToast } from '@/components/ui/toast';
import { ConfirmDialog } from '../shared/confirm-dialog';

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
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        } else {
          toast('블록 상태 변경에 실패했습니다.', 'error');
        }
      } catch {
        toast('네트워크 오류가 발생했습니다.', 'error');
      }
    });
  }

  function handleDeleteConfirm() {
    setShowDeleteConfirm(false);
    startTransition(async () => {
      try {
        const res = await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks/${block.id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          onDelete(block.id);
          toast('블록이 삭제되었습니다.', 'success');
        } else {
          toast('블록 삭제에 실패했습니다.', 'error');
        }
      } catch {
        toast('네트워크 오류가 발생했습니다.', 'error');
      }
    });
  }

  return (
    <>
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
              className="block-card-btn block-card-btn--delete"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isPending}
              type="button"
              title="삭제"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        title="블록 삭제"
        message={`"${block.title || meta?.labelKo || block.type}" 블록을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
