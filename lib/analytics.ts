/* eslint-disable @typescript-eslint/no-unsafe-function-type, @typescript-eslint/no-explicit-any */

/**
 * Track a custom event across all analytics providers.
 * Works on client-side only (safely no-ops on server).
 */
export function trackEvent(name: string, properties?: Record<string, string | number>) {
  if (typeof window === 'undefined') return;

  const w: Record<string, any> = window as any; // eslint-disable-line

  // Vercel Analytics
  try {
    if (typeof w.va === 'function') {
      w.va('event', { name, ...properties });
    }
  } catch {
    // silently ignore
  }

  // Google Analytics (gtag)
  try {
    if (typeof w.gtag === 'function') {
      w.gtag('event', name, properties);
    }
  } catch {
    // silently ignore
  }
}
