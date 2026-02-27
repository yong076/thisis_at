'use client';

import { getThemeById, DEFAULT_THEME_ID, themeToCssVars } from '@/lib/themes';
import type { ThemeConfig } from '@/lib/themes';
import { getFontById, getFontCssUrl, DEFAULT_FONT_BODY, DEFAULT_FONT_DISPLAY } from '@/lib/fonts';
import { MeshBackground } from './mesh-background';
import { SparkleLayer } from './sparkle-layer';
import { useEffect } from 'react';

type Props = {
  themeId?: string;
  fontBodyId?: string;
  fontDisplayId?: string;
  showSparkles?: boolean;
  children: React.ReactNode;
};

export function ThemedProfileShell({
  themeId,
  fontBodyId,
  fontDisplayId,
  showSparkles = true,
  children,
}: Props) {
  const theme: ThemeConfig = getThemeById(themeId ?? DEFAULT_THEME_ID);
  const cssVars = themeToCssVars(theme);

  const bodyFontId = fontBodyId ?? DEFAULT_FONT_BODY;
  const displayFontId = fontDisplayId ?? DEFAULT_FONT_DISPLAY;

  // Dynamically load fonts
  useEffect(() => {
    const fontsToLoad: string[] = [];

    const bodyFont = getFontById(bodyFontId);
    if (bodyFont) {
      const url = getFontCssUrl(bodyFont);
      if (url) fontsToLoad.push(url);
    }

    const displayFont = getFontById(displayFontId);
    if (displayFont) {
      const url = getFontCssUrl(displayFont);
      if (url) fontsToLoad.push(url);
    }

    const links: HTMLLinkElement[] = [];
    for (const url of fontsToLoad) {
      if (document.querySelector(`link[href="${url}"]`)) continue;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
      links.push(link);
    }

    return () => {
      for (const link of links) {
        link.remove();
      }
    };
  }, [bodyFontId, displayFontId]);

  // Build style with CSS vars + font overrides
  const shellStyle: Record<string, string> = {
    ...cssVars,
    minHeight: '100dvh',
    position: 'relative',
  };

  const bodyFont = getFontById(bodyFontId);
  const displayFont = getFontById(displayFontId);
  if (bodyFont) {
    shellStyle['--font-body'] = `'${bodyFont.name}', system-ui, sans-serif`;
  }
  if (displayFont) {
    shellStyle['--font-display'] = `'${displayFont.name}', serif`;
  }

  return (
    <div className="shell" style={shellStyle}>
      <MeshBackground
        colors={theme.bgMesh}
        baseColor={theme.meshBaseColor}
        opacity={theme.meshOpacity}
      />
      {showSparkles && <SparkleLayer colors={theme.sparkleColors} />}
      {children}
    </div>
  );
}
