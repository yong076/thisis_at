import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /@handle → /u/handle (public profile)
  if (pathname.startsWith('/@')) {
    const withoutPrefix = pathname.slice(2);
    const [handle, maybeSub] = withoutPrefix.split('/');

    if (!handle) {
      return NextResponse.next();
    }

    const rewritten = request.nextUrl.clone();

    if (maybeSub === 'events') {
      rewritten.pathname = `/u/${handle}/events`;
    } else {
      rewritten.pathname = `/u/${handle}`;
    }

    return NextResponse.rewrite(rewritten);
  }

  // /editor/@handle → /editor/handle (strip @ from editor paths)
  if (pathname.startsWith('/editor/@')) {
    const handle = pathname.slice('/editor/@'.length);

    if (!handle) {
      return NextResponse.next();
    }

    const rewritten = request.nextUrl.clone();
    rewritten.pathname = `/editor/${handle}`;

    return NextResponse.rewrite(rewritten);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
