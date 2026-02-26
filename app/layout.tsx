import type { Metadata } from 'next';
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google';
import { MeshBackground } from '@/components/public/mesh-background';
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
  description: '아티스트, 공연장, 크리에이터를 위한 링크 인 바이오 미니사이트',
  metadataBase: new URL('https://thisis.at'),
  openGraph: {
    title: 'thisis.at',
    description: '아티스트, 공연장, 크리에이터를 위한 링크 인 바이오 미니사이트',
    type: 'website',
    url: 'https://thisis.at'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${display.variable} ${body.variable}`}>
        <div className="shell">
          <MeshBackground />
          {children}
        </div>
      </body>
    </html>
  );
}
