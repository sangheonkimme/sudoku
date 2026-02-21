import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  SUPPORTED_LOCALES,
  getMessages,
  isSupportedLocale,
  localeFromAcceptLanguage,
  localeFromCountry,
  normalizeLocale,
} from '@/lib/i18n';

describe('i18n utilities', () => {
  test('exports stable defaults', () => {
    expect(DEFAULT_LOCALE).toBe('en');
    expect(LOCALE_COOKIE).toBe('sudoku-locale');
    expect(SUPPORTED_LOCALES).toEqual(['ko', 'en', 'jp']);
  });

  test('validates locale support', () => {
    expect(isSupportedLocale('ko')).toBe(true);
    expect(isSupportedLocale('en')).toBe(true);
    expect(isSupportedLocale('jp')).toBe(true);
    expect(isSupportedLocale('ja')).toBe(false);
    expect(isSupportedLocale(undefined)).toBe(false);
  });

  test('normalizes locale values', () => {
    expect(normalizeLocale('ko')).toBe('ko');
    expect(normalizeLocale('en')).toBe('en');
    expect(normalizeLocale('jp')).toBe('jp');
    expect(normalizeLocale('ja')).toBeNull();
    expect(normalizeLocale('')).toBeNull();
  });

  test('maps country code to locale', () => {
    expect(localeFromCountry('KR')).toBe('ko');
    expect(localeFromCountry('kr')).toBe('ko');
    expect(localeFromCountry('JP')).toBe('jp');
    expect(localeFromCountry('US')).toBeNull();
    expect(localeFromCountry(undefined)).toBeNull();
  });

  test('maps Accept-Language header to locale', () => {
    expect(localeFromAcceptLanguage('ko-KR,ko;q=0.9,en;q=0.8')).toBe('ko');
    expect(localeFromAcceptLanguage('ja-JP,ja;q=0.9,en;q=0.8')).toBe('jp');
    expect(localeFromAcceptLanguage('en-US,en;q=0.9')).toBe('en');
    expect(localeFromAcceptLanguage('fr-FR,fr;q=0.9')).toBeNull();
    expect(localeFromAcceptLanguage(undefined)).toBeNull();
  });

  test('returns locale messages', () => {
    const ko = getMessages('ko');
    const en = getMessages('en');
    const jp = getMessages('jp');

    expect(ko.site.languageLabel).toBe('언어');
    expect(en.site.languageLabel).toBe('Language');
    expect(jp.site.languageLabel).toBe('言語');
  });
});

