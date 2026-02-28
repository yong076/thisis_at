'use client';

import { useState, useCallback, useTransition } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { SortableBlockItem } from './sortable-block-item';
import { BlockAddDialog } from './block-add-dialog';
import { BlockEditDialog } from './block-edit-dialog';
import { useT } from '@/lib/i18n/client';
import type { ProfileBlock, BlockType, ProfileType } from '@/lib/types';

type Props = {
  blocks: ProfileBlock[];
  handle: string;
  profileType: ProfileType;
  onBlocksChange: (blocks: ProfileBlock[]) => void;
};

export function BlocksTab({ blocks, handle, profileType, onBlocksChange }: Props) {
  const t = useT();
  const [, startTransition] = useTransition();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingBlock, setEditingBlock] = useState<ProfileBlock | null>(null);
  const [newBlockType, setNewBlockType] = useState<BlockType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({ ...b, order: i }));
      onBlocksChange(reordered);

      // Persist reorder
      startTransition(async () => {
        try {
          await fetch(`/api/editor/${encodeURIComponent(handle)}/blocks/reorder`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderedIds: reordered.map((b) => b.id) }),
          });
        } catch {
          // silently ignore
        }
      });
    },
    [blocks, handle, onBlocksChange, startTransition],
  );

  const handleToggle = useCallback(
    (blockId: string, enabled: boolean) => {
      onBlocksChange(blocks.map((b) => (b.id === blockId ? { ...b, enabled } : b)));
    },
    [blocks, onBlocksChange],
  );

  const handleDelete = useCallback(
    (blockId: string) => {
      onBlocksChange(blocks.filter((b) => b.id !== blockId));
    },
    [blocks, onBlocksChange],
  );

  const handleEdit = useCallback((block: ProfileBlock) => {
    setEditingBlock(block);
  }, []);

  const handleBlockTypeSelected = useCallback((type: BlockType) => {
    setNewBlockType(type);
  }, []);

  const handleBlockSaved = useCallback(
    (savedBlock: ProfileBlock) => {
      if (editingBlock) {
        // Update existing
        onBlocksChange(blocks.map((b) => (b.id === savedBlock.id ? savedBlock : b)));
      } else {
        // Add new
        onBlocksChange([...blocks, savedBlock]);
      }
      setEditingBlock(null);
      setNewBlockType(null);
    },
    [blocks, editingBlock, onBlocksChange],
  );

  return (
    <section style={{ marginTop: '1rem' }}>
      {/* Add Block Button */}
      <button
        className="block-add-button"
        onClick={() => setShowAddDialog(true)}
        type="button"
      >
        <span>＋</span> {t('blocks.addBlock')}
      </button>

      {/* Block List with DnD */}
      {blocks.length === 0 ? (
        <div className="block-empty">
          <p>{t('blocks.empty')}</p>
          <p className="subtitle">{t('blocks.emptyHint')}</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="block-list">
              {blocks.map((block) => (
                <SortableBlockItem
                  key={block.id}
                  block={block}
                  handle={handle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Block Dialog */}
      <BlockAddDialog
        open={showAddDialog}
        profileType={profileType}
        onClose={() => setShowAddDialog(false)}
        onSelect={handleBlockTypeSelected}
      />

      {/* Edit Block Dialog (for editing existing block) */}
      <BlockEditDialog
        open={!!editingBlock}
        block={editingBlock}
        handle={handle}
        onClose={() => setEditingBlock(null)}
        onSaved={handleBlockSaved}
      />

      {/* New Block Dialog (for creating with selected type) */}
      <BlockEditDialog
        open={!!newBlockType}
        block={null}
        newBlockType={newBlockType ?? undefined}
        handle={handle}
        onClose={() => setNewBlockType(null)}
        onSaved={handleBlockSaved}
      />
    </section>
  );
}
