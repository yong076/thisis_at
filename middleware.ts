import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const PROTECTED_PREFIXES = ['/admin', '/editor', '/settings'];
const SUPPORTED_LOCALES = ['ko', 'en', 'ja'];

function detectLocale(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'ko';
  const langs = acceptLanguage.split(',').map((part) => {
    const [lang, q] = part.trim().split(';q=');
    return { lang: lang.split('-')[0].toLowerCase(), q: q ? parseFloat(q) : 1 };
  });
  langs.sort((a, b) => b.q - a.q);
  for (const { lang } of langs) {
    if (SUPPORTED_LOCALES.includes(lang)) return lang;
  }
  return 'ko';
}

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const hasLocaleCookie = !!req.cookies.get('locale');

  // Helper: attach locale cookie to any response if not already set
  function withLocale(response: NextResponse): NextResponse {
    if (!hasLocaleCookie) {
      const detected = detectLocale(req.headers.get('accept-language'));
      response.cookies.set('locale', detected, { path: '/', maxAge: 31536000, sameSite: 'lax' });
    }
    return response;
  }

  // /@handle → /u/handle (public profile)
  if (pathname.startsWith('/@')) {
    const withoutPrefix = pathname.slice(2);
    const [handle, maybeSub] = withoutPrefix.split('/');

    if (!handle) {
      return withLocale(NextResponse.next());
    }

    const rewritten = req.nextUrl.clone();

    if (maybeSub === 'events') {
      rewritten.pathname = `/u/${handle}/events`;
    } else {
      rewritten.pathname = `/u/${handle}`;
    }

    return withLocale(NextResponse.rewrite(rewritten));
  }

  // /editor/@handle → /editor/handle (strip @ from editor paths)
  if (pathname.startsWith('/editor/@')) {
    const handle = pathname.slice('/editor/@'.length);

    if (!handle) {
      return withLocale(NextResponse.next());
    }

    const rewritten = req.nextUrl.clone();
    rewritten.pathname = `/editor/${handle}`;

    return withLocale(NextResponse.rewrite(rewritten));
  }

  // Protected routes → redirect to /login if not authenticated
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !req.auth) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';
    loginUrl.searchParams.set('callbackUrl', pathname);
    return withLocale(NextResponse.redirect(loginUrl));
  }

  return withLocale(NextResponse.next());
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
};
