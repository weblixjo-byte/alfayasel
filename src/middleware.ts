import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const LOCALES = ['en', 'ar'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Authentication Guard (Run only on admin dashboard routes)
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET || 'alfayasel-secret-key-2026-woodmart-secure',
    });

    if (!token || token.role !== 'admin') {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // 2. Allow root '/' to proceed directly
  if (pathname === '/' || pathname === '') {
    return NextResponse.next();
  }

  // 3. Check if path already contains language prefix (/ar or /en)
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // 4. Clean non-localized routes forwarded to default /en
  return NextResponse.rewrite(new URL(`/en${pathname}`, request.url));
}

export const config = {
  matcher: [
    // Strictly exclude static files, images, API, Next.js chunks, favicon, robots, and sitemap
    '/((?!api|_next/static|_next/image|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
