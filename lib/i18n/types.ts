export type Locale = 'ko' | 'en' | 'ja';

export const LOCALES: Locale[] = ['ko', 'en', 'ja'];
export const DEFAULT_LOCALE: Locale = 'ko';

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  ja: '日本語',
};

export type Dictionary = Record<string, string>;
