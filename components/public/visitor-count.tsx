'use client';

import { useState, useEffect } from 'react';
import { useT } from '@/lib/i18n/client';

export function VisitorCount({ profileId }: { profileId: string }) {
  const [count, setCount] = useState<number | null>(null);
  const t = useT();

  useEffect(() => {
    fetch(`/api/v1/profiles/id/${encodeURIComponent(profileId)}/visitors`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.count === 'number') {
          setCount(data.count);
        }
      })
      .catch(() => {});
  }, [profileId]);

  if (count === null || count === 0) return null;

  return (
    <div className="visitor-badge">
      <span className="visitor-badge-icon" aria-hidden="true">👀</span>
      <span>{t('visitor.count', { count: count.toLocaleString() })}</span>
    </div>
  );
}
