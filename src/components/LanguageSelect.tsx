'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { LOCALE_COOKIE, LOCALE_NAMES, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n';
import { useI18n } from '@/lib/i18nContext';

export default function LanguageSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { locale, messages } = useI18n();

  const currentPathWithoutLocale = useMemo(() => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length === 0) return '';
    if (SUPPORTED_LOCALES.includes(parts[0] as Locale)) {
      return parts.slice(1).join('/');
    }
    return parts.join('/');
  }, [pathname]);

  const onChangeLocale = (nextLocale: Locale) => {
    const basePath = currentPathWithoutLocale ? `/${currentPathWithoutLocale}` : '';
    const queryString = searchParams.toString();
    const nextPath = `/${nextLocale}${basePath}`;
    const href = queryString ? `${nextPath}?${queryString}` : nextPath;

    document.cookie = `${LOCALE_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    router.push(href);
  };

  return (
    <label className="language-wrap">
      <span className="language-label">{messages.site.languageLabel}</span>
      <select
        className="language-select"
        data-testid="language-select"
        value={locale}
        onChange={(e) => onChangeLocale(e.target.value as Locale)}
        aria-label={messages.site.languageLabel}
      >
        {SUPPORTED_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_NAMES[code]}
          </option>
        ))}
      </select>
    </label>
  );
}
