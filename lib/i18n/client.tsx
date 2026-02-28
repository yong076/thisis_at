'use client';

import { createContext, useContext, useCallback } from 'react';
import type { Locale, Dictionary } from './types';
import { DEFAULT_LOCALE, LOCALES } from './types';
import { ko } from './dictionaries/ko';
import { en } from './dictionaries/en';
import { ja } from './dictionaries/ja';

const dictionaries: Record<Locale, Dictionary> = { ko, en, ja };

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  dict: ko,
});

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dict = dictionaries[locale] ?? ko;
  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): Locale {
  return useContext(LocaleContext).locale;
}

export function useT(): (key: string, params?: Record<string, string | number>) => string {
  const { dict } = useContext(LocaleContext);
  return useCallback(
    (key: string, params?: Record<string, string | number>) => {
      let value = dict[key] ?? ko[key] ?? key;
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          value = value.replace(`{${k}}`, String(v));
        }
      }
      return value;
    },
    [dict],
  );
}

/** Read locale from cookie on client side */
export function getClientLocale(): Locale {
  if (typeof document === 'undefined') return DEFAULT_LOCALE;
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  const raw = match?.[1];
  if (raw && LOCALES.includes(raw as Locale)) return raw as Locale;
  return DEFAULT_LOCALE;
}

/** Set locale cookie and reload page */
export function switchLocale(locale: Locale) {
  document.cookie = `locale=${locale};path=/;max-age=31536000;samesite=lax`;
  window.location.reload();
}
