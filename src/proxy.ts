import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  isSupportedLocale,
  localeFromAcceptLanguage,
  localeFromCountry,
  type Locale,
} from '@/lib/i18n';

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isSupportedLocale(cookieLocale)) {
    return cookieLocale;
  }

  const countryLocale = localeFromCountry(request.headers.get('x-vercel-ip-country'));
  if (countryLocale) {
    return countryLocale;
  }

  const languageLocale = localeFromAcceptLanguage(request.headers.get('accept-language'));
  if (languageLocale) {
    return languageLocale;
  }

  return DEFAULT_LOCALE;
}

function setLocaleCookie(response: NextResponse, locale: Locale) {
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathLocale = pathname.split('/')[1];

  if (isSupportedLocale(pathLocale)) {
    const response = NextResponse.next();
    setLocaleCookie(response, pathLocale);
    return response;
  }

  const locale = detectLocale(request);
  const nextUrl = request.nextUrl.clone();
  nextUrl.pathname = `/${locale}${pathname}`;
  const response = NextResponse.redirect(nextUrl);
  setLocaleCookie(response, locale);
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};

