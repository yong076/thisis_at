'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from '@/lib/i18n/client';
import type { Locale } from '@/lib/i18n/types';
import { LOCALES } from '@/lib/i18n/types';

const SHORT_LABELS: Record<Locale, string> = {
  ko: 'KO',
  en: 'EN',
  ja: 'JA',
};

export function LanguageSwitcher() {
  const current = useLocale();
  const router = useRouter();

  function handleSwitch(loc: Locale) {
    if (loc === current) return;
    // Set cookie then soft-refresh (no white flash)
    document.cookie = `locale=${loc};path=/;max-age=31536000;samesite=lax`;
    router.refresh();
  }

  return (
    <div className="lang-switcher" role="group" aria-label="Language">
      {LOCALES.map((loc) => (
        <button
          key={loc}
          type="button"
          className={`lang-btn ${current === loc ? 'lang-btn--active' : ''}`}
          onClick={() => handleSwitch(loc)}
          aria-current={current === loc ? 'true' : undefined}
        >
          {SHORT_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
