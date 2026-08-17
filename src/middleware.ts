import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const LOCALES = ['en', 'ar'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next.js internal files, static assets, images, and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Handle Admin Auth Guard
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

  // Redirect /en to / and /en/path to /path
  if (pathname === '/en') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  if (pathname.startsWith('/en/')) {
    const cleanPath = pathname.substring(3);
    return NextResponse.redirect(new URL(cleanPath, request.url));
  }
  // Redirect old /about to /about-us
  if (pathname === '/about') {
    return NextResponse.redirect(new URL('/about-us', request.url));
  }
  if (pathname === '/ar/about') {
    return NextResponse.redirect(new URL('/ar/about-us', request.url));
  }
  if (pathname === '/en/about') {
    return NextResponse.redirect(new URL('/about-us', request.url));
  }
  // Redirect old /contact to /contact-us
  if (pathname === '/contact') {
    return NextResponse.redirect(new URL('/contact-us', request.url));
  }
  if (pathname === '/ar/contact') {
    return NextResponse.redirect(new URL('/ar/contact-us', request.url));
  }
  if (pathname === '/en/contact') {
    return NextResponse.redirect(new URL('/contact-us', request.url));
  }
  // Redirect old /privacy-policy to /privacy-policy-3
  if (pathname === '/privacy-policy') {
    return NextResponse.redirect(new URL('/privacy-policy-3', request.url));
  }
  if (pathname === '/ar/privacy-policy') {
    return NextResponse.redirect(new URL('/ar/privacy-policy-3', request.url));
  }
  if (pathname === '/en/privacy-policy') {
    return NextResponse.redirect(new URL('/privacy-policy-3', request.url));
  }
  // Redirect old /returns to /return-policy
  if (pathname === '/returns') {
    return NextResponse.redirect(new URL('/return-policy', request.url));
  }
  if (pathname === '/ar/returns') {
    return NextResponse.redirect(new URL('/ar/return-policy', request.url));
  }
  if (pathname === '/en/returns') {
    return NextResponse.redirect(new URL('/return-policy', request.url));
  }
  // Redirect old /cancellation to /cancellation-policy
  if (pathname === '/cancellation') {
    return NextResponse.redirect(new URL('/cancellation-policy', request.url));
  }
  if (pathname === '/ar/cancellation') {
    return NextResponse.redirect(new URL('/ar/cancellation-policy', request.url));
  }
  if (pathname === '/en/cancellation') {
    return NextResponse.redirect(new URL('/cancellation-policy', request.url));
  }
  // Redirect old /terms-and-conditions / /en/terms-and-conditions to /trems-and-conditions
  if (pathname === '/terms-and-conditions') {
    return NextResponse.redirect(new URL('/trems-and-conditions', request.url));
  }
  if (pathname === '/ar/terms-and-conditions') {
    return NextResponse.redirect(new URL('/ar/trems-and-conditions', request.url));
  }
  if (pathname === '/en/terms-and-conditions') {
    return NextResponse.redirect(new URL('/trems-and-conditions', request.url));
  }
  if (pathname === '/en/trems-and-conditions') {
    return NextResponse.redirect(new URL('/trems-and-conditions', request.url));
  }
  // Allow root '/' and empty path to proceed directly without redirection
  if (pathname === '/' || pathname === '') {
    return NextResponse.next();
  }

  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // If someone enters a path like /shop without locale, rewrite/forward to /en/shop
  return NextResponse.rewrite(new URL(`/en${pathname}`, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
