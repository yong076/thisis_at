'use client';

import type { ProfileBlock, TrappistEvent } from '@/lib/types';
import { useT } from '@/lib/i18n/client';
import { renderBlockContent } from '@/lib/block-render-content';

type Props = {
  block: ProfileBlock;
  events: TrappistEvent[];
};

export function BlockRendererClient({ block, events }: Props) {
  const t = useT();
  return renderBlockContent(block, events, t);
}
