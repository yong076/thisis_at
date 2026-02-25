import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
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

export const metadata: Metadata = {
  title: 'thisis.at',
  description: 'Link-in-bio + mini-site for artists, venues, and creators',
  metadataBase: new URL('https://thisis.at'),
  openGraph: {
    title: 'thisis.at',
    description: 'Link-in-bio + mini-site for artists, venues, and creators',
    type: 'website',
    url: 'https://thisis.at'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable}`}>
        <div className="shell">{children}</div>
      </body>
    </html>
  );
}
