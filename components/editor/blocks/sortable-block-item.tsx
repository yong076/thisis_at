'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BlockCard } from './block-card';
import type { ProfileBlock } from '@/lib/types';

type Props = {
  block: ProfileBlock;
  handle: string;
  onEdit: (block: ProfileBlock) => void;
  onDelete: (blockId: string) => void;
  onToggle: (blockId: string, enabled: boolean) => void;
};

export function SortableBlockItem({ block, handle, onEdit, onDelete, onToggle }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 'auto' as const,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <BlockCard
        block={block}
        handle={handle}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggle={onToggle}
        dragHandleProps={listeners}
      />
    </div>
  );
}
