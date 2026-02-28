'use client';

import { useMemo, memo } from 'react';
import { ThemedProfileShell } from '@/components/public/themed-profile-shell';
import { ProfileHeader } from '@/components/public/profile-header';
import { BlockRendererClient } from './block-renderer-client';
import { EditableBlockWrapper, InsertBlockButton } from './editable-block-wrapper';
import type { PublicProfile, ProfileBlock } from '@/lib/types';

type Props = {
  profile: PublicProfile;
  blocks: ProfileBlock[];
  themeId: string;
  fontBodyId: string;
  fontDisplayId: string;
  buttonStyle: string;
  cardStyle: string;
  showSparkles: boolean;
  onEditBlock: (block: ProfileBlock) => void;
  onToggleBlock: (blockId: string, enabled: boolean) => void;
  onDeleteBlock: (blockId: string) => void;
  onInsertBlock: (index: number) => void;
};

export const LivePreview = memo(function LivePreview({
  profile,
  blocks,
  themeId,
  fontBodyId,
  fontDisplayId,
  buttonStyle,
  cardStyle,
  showSparkles,
  onEditBlock,
  onToggleBlock,
  onDeleteBlock,
  onInsertBlock,
}: Props) {
  const sortedBlocks = useMemo(
    () => [...blocks].sort((a, b) => a.order - b.order),
    [blocks],
  );

  return (
    <div className="phone-frame">
      <div className="phone-frame-inner">
        <ThemedProfileShell
          themeId={themeId}
          fontBodyId={fontBodyId}
          fontDisplayId={fontDisplayId}
          showSparkles={showSparkles}
          buttonStyle={buttonStyle}
          cardStyle={cardStyle}
        >
          <div className="page page--narrow" style={{ minHeight: 'auto', paddingBottom: '2rem' }}>
            <header className="top-nav">
              <span className="brand" style={{ pointerEvents: 'none' }}>thisis.at</span>
            </header>

            <ProfileHeader profile={profile} />

            <section className="block-list">
              <InsertBlockButton onClick={() => onInsertBlock(0)} />

              {sortedBlocks.map((block, i) => (
                <div key={block.id}>
                  <EditableBlockWrapper
                    block={block}
                    onEdit={onEditBlock}
                    onToggle={onToggleBlock}
                    onDelete={onDeleteBlock}
                  >
                    <BlockRendererClient block={block} events={profile.events} />
                  </EditableBlockWrapper>
                  <InsertBlockButton onClick={() => onInsertBlock(i + 1)} />
                </div>
              ))}
            </section>

            <footer className="profile-footer" style={{ pointerEvents: 'none' }}>
              <p>thisis.at</p>
            </footer>
          </div>
        </ThemedProfileShell>
      </div>
    </div>
  );
});
