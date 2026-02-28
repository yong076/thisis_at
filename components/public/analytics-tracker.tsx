'use client';

import { useEffect } from 'react';

export function AnalyticsTracker({ profileId }: { profileId: string }) {
  useEffect(() => {
    // Generate or retrieve session ID
    let sessionId = sessionStorage.getItem('_at_sid');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('_at_sid', sessionId);
    }

    // Extract UTM params from URL
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');
    const utmContent = params.get('utm_content');
    const utmTerm = params.get('utm_term');

    const payload = JSON.stringify({
      profileId,
      sessionId,
      referrer: document.referrer || null,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
    });

    // Use sendBeacon for non-blocking fire-and-forget
    if (navigator.sendBeacon) {
      navigator.sendBeacon(
        '/api/analytics/track/pageview',
        new Blob([payload], { type: 'application/json' }),
      );
    } else {
      fetch('/api/analytics/track/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [profileId]);

  return null;
}
