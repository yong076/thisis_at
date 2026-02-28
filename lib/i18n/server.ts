import { cookies } from 'next/headers';
import type { Locale, Dictionary } from './types';
import { DEFAULT_LOCALE, LOCALES } from './types';
import { ko } from './dictionaries/ko';
import { en } from './dictionaries/en';
import { ja } from './dictionaries/ja';

const dictionaries: Record<Locale, Dictionary> = { ko, en, ja };

export function getLocale(): Locale {
  const cookieStore = cookies();
  const raw = cookieStore.get('locale')?.value;
  if (raw && LOCALES.includes(raw as Locale)) return raw as Locale;
  return DEFAULT_LOCALE;
}

export function getDictionary(locale?: Locale): Dictionary {
  return dictionaries[locale ?? getLocale()];
}

/** Returns a translate function for server components */
export function getT(locale?: Locale): (key: string, params?: Record<string, string | number>) => string {
  const dict = getDictionary(locale);
  return (key, params) => {
    let value = dict[key] ?? ko[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        value = value.replace(`{${k}}`, String(v));
      }
    }
    return value;
  };
}
