import type { ProfileBlock, TrappistEvent } from '@/lib/types';
import { getT } from '@/lib/i18n/server';
import { renderBlockContent } from '@/lib/block-render-content';

type Props = {
  block: ProfileBlock;
  events: TrappistEvent[];
};

export function BlockRenderer({ block, events }: Props) {
  return renderBlockContent(block, events, getT());
}
