'use client';

import { useCallback, type ReactNode } from 'react';

type Props = {
  profileId: string;
  blockId: string;
  blockType: string;
  children: ReactNode;
};

export function TrackedBlockWrapper({ profileId, blockId, blockType, children }: Props) {
  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Find closest <a> from the click target
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const targetUrl = anchor.href;
      const label = anchor.textContent?.trim().slice(0, 100) || null;

      // Set ripple position CSS variables
      const rect = anchor.getBoundingClientRect();
      anchor.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
      anchor.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);

      const payload = JSON.stringify({
        profileId,
        blockId,
        blockType,
        targetUrl,
        label,
      });

      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/track/click',
          new Blob([payload], { type: 'application/json' }),
        );
      } else {
        fetch('/api/analytics/track/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }
    },
    [profileId, blockId, blockType],
  );

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
}
