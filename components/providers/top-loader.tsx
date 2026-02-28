'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function TopLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<'idle' | 'loading' | 'complete'>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Complete on route change
  useEffect(() => {
    if (state === 'loading') {
      setState('complete');
      timeoutRef.current = setTimeout(() => setState('idle'), 300);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [pathname, searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // Intercept internal link clicks
  const handleClick = useCallback((e: MouseEvent) => {
    const anchor = (e.target as HTMLElement).closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href) return;

    // Skip external links, hash links, new tab links
    if (
      href.startsWith('http') ||
      href.startsWith('#') ||
      anchor.target === '_blank' ||
      e.metaKey ||
      e.ctrlKey
    ) {
      return;
    }

    // Skip if same page
    if (href === pathname) return;

    setState('loading');
  }, [pathname]);

  useEffect(() => {
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [handleClick]);

  if (state === 'idle') return null;

  return (
    <div
      className={`top-loader ${state === 'complete' ? 'top-loader--complete' : ''}`}
      role="progressbar"
    />
  );
}
