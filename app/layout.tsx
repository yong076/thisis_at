import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { AuthSessionProvider } from '@/components/providers/session-provider';
import { GoogleAnalytics } from '@/components/providers/google-analytics';
import { TopLoader } from '@/components/providers/top-loader';
import { LocaleProvider } from '@/lib/i18n/client';
import { getLocale, getT } from '@/lib/i18n/server';
import '@/app/globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '700']
});

const body = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700']
});

export function generateMetadata(): Metadata {
  const t = getT();
  return {
    title: 'thisis.at',
    description: t('home.description'),
    metadataBase: new URL('https://thisis.at'),
    openGraph: {
      title: 'thisis.at',
      description: t('home.og.description'),
      type: 'website',
      url: 'https://thisis.at'
    }
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = getLocale();

  return (
    <html lang={locale}>
      <body className={`${display.variable} ${body.variable}`}>
        <LocaleProvider locale={locale}>
          <TopLoader />
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </LocaleProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
