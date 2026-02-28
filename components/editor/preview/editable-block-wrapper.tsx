'use client';

import { type ReactNode } from 'react';
import type { ProfileBlock } from '@/lib/types';

type EditableBlockProps = {
  block: ProfileBlock;
  onEdit: (block: ProfileBlock) => void;
  onToggle: (blockId: string, enabled: boolean) => void;
  onDelete: (blockId: string) => void;
  children: ReactNode;
};

export function EditableBlockWrapper({ block, onEdit, onToggle, onDelete, children }: EditableBlockProps) {
  return (
    <div
      className={`editable-block-wrapper ${!block.enabled ? 'editable-block-wrapper--disabled' : ''}`}
      role="button"
      tabIndex={0}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('.editable-block-toolbar')) return;
        onEdit(block);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onEdit(block);
        }
      }}
    >
      <div className="editable-block-toolbar">
        <button
          type="button"
          title="Edit"
          onClick={(e) => { e.stopPropagation(); onEdit(block); }}
        >
          ✏️
        </button>
        <button
          type="button"
          title={block.enabled ? 'Hide' : 'Show'}
          onClick={(e) => { e.stopPropagation(); onToggle(block.id, !block.enabled); }}
        >
          {block.enabled ? '👁️' : '🚫'}
        </button>
        <button
          type="button"
          title="Delete"
          onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}
        >
          🗑️
        </button>
      </div>
      {!block.enabled && <div className="editable-block-badge">Hidden</div>}
      {children}
    </div>
  );
}

type InsertBlockButtonProps = {
  onClick: () => void;
};

export function InsertBlockButton({ onClick }: InsertBlockButtonProps) {
  return (
    <button
      type="button"
      className="insert-block-btn"
      onClick={onClick}
    >
      <span className="insert-block-icon">+</span>
    </button>
  );
}
