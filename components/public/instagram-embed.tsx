'use client';

import { useEffect, useRef } from 'react';

type Props = {
  postUrl: string;
  caption?: string;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function processEmbeds() {
  const w = window as any;
  if (w.instgrm?.Embeds?.process) {
    w.instgrm.Embeds.process();
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function InstagramEmbed({ postUrl, caption }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!(window as any).instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);
      script.onload = () => processEmbeds();
    } else {
      processEmbeds();
    }
  }, [postUrl]);

  // Normalize URL to ensure it ends with /
  const normalizedUrl = postUrl.endsWith('/') ? postUrl : `${postUrl}/`;

  return (
    <div ref={containerRef} className="instagram-embed-wrap">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={normalizedUrl}
        data-instgrm-version="14"
        style={{
          background: 'transparent',
          border: '0',
          borderRadius: 'var(--radius-sm)',
          margin: '0',
          maxWidth: '100%',
          minWidth: '280px',
          padding: '0',
          width: '100%',
        }}
      >
        <a href={normalizedUrl} target="_blank" rel="noreferrer noopener">
          {caption ?? 'Instagram 게시물 보기'}
        </a>
      </blockquote>
    </div>
  );
}
