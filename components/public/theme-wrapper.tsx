'use client';

import { useEffect } from 'react';
import type { ThemeConfig } from '@/lib/themes';
import { themeToCssVars } from '@/lib/themes';
import { getFontById, getFontCssUrl } from '@/lib/fonts';

type Props = {
  theme: ThemeConfig;
  fontBodyId?: string;
  fontDisplayId?: string;
  children: React.ReactNode;
};

export function ThemeWrapper({ theme, fontBodyId, fontDisplayId, children }: Props) {
  const cssVars = themeToCssVars(theme);

  // Dynamically load fonts
  useEffect(() => {
    const fontsToLoad: string[] = [];

    if (fontBodyId) {
      const font = getFontById(fontBodyId);
      if (font) {
        const url = getFontCssUrl(font);
        if (url) fontsToLoad.push(url);
        // Set CSS variable for body font
        document.documentElement.style.setProperty('--font-body-dynamic', `'${font.name}', system-ui, sans-serif`);
      }
    }

    if (fontDisplayId) {
      const font = getFontById(fontDisplayId);
      if (font) {
        const url = getFontCssUrl(font);
        if (url) fontsToLoad.push(url);
        document.documentElement.style.setProperty('--font-display-dynamic', `'${font.name}', serif`);
      }
    }

    // Load fonts via <link> tags
    const links: HTMLLinkElement[] = [];
    for (const url of fontsToLoad) {
      // Skip if already loaded
      if (document.querySelector(`link[href="${url}"]`)) continue;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      links.push(link);
    }

    return () => {
      // Clean up dynamically added links
      for (const link of links) {
        link.remove();
      }
    };
  }, [fontBodyId, fontDisplayId]);

  // Build combined style including CSS vars and background color
  const wrapperStyle: Record<string, string> = {
    ...cssVars,
    backgroundColor: theme.bgBase,
    color: theme.textPrimary,
    minHeight: '100dvh',
  };

  // Apply dynamic font families if set
  if (fontBodyId) {
    const font = getFontById(fontBodyId);
    if (font) {
      wrapperStyle['--font-body'] = `'${font.name}', system-ui, sans-serif`;
    }
  }
  if (fontDisplayId) {
    const font = getFontById(fontDisplayId);
    if (font) {
      wrapperStyle['--font-display'] = `'${font.name}', serif`;
    }
  }

  return (
    <div style={wrapperStyle}>
      {children}
    </div>
  );
}
