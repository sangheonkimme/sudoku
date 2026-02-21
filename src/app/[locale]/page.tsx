import type { Metadata } from 'next';
import LanguageSelect from '@/components/LanguageSelect';
import GameContainer from '@/components/GameContainer';
import { GameProvider } from '@/lib/gameContext';
import { I18nProvider } from '@/lib/i18nContext';
import {
  DEFAULT_LOCALE,
  getMessages,
  type Locale,
  normalizeLocale,
  SUPPORTED_LOCALES,
} from '@/lib/i18n';
import { notFound } from 'next/navigation';

const LOCALE_METADATA: Record<Locale, { title: string; description: string; ogLocale: string }> = {
  ko: {
    title: '스도쿠 온라인 - 무료 스도쿠 퍼즐 게임',
    description:
      '무료 온라인 스도쿠 퍼즐! Easy, Medium, Hard, Expert 4단계 난이도를 선택하고, 힌트와 메모 기능으로 스도쿠를 풀어보세요.',
    ogLocale: 'ko_KR',
  },
  en: {
    title: 'Sudoku Online - Free Sudoku Puzzle Game',
    description:
      'Play free online Sudoku with Easy, Medium, Hard, and Expert levels. Solve faster with notes, hints, and keyboard shortcuts.',
    ogLocale: 'en_US',
  },
  jp: {
    title: '数独オンライン - 無料で遊べる数独パズル',
    description:
      '無料で遊べるオンライン数独。初級から達人まで4段階の難易度に対応し、ヒントやメモ機能で快適にプレイできます。',
    ogLocale: 'ja_JP',
  },
};

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale) ?? DEFAULT_LOCALE;
  const meta = LOCALE_METADATA[locale];

  return {
    title: { absolute: meta.title },
    description: meta.description,
    openGraph: {
      type: 'website',
      locale: meta.ogLocale,
      alternateLocale: locale === 'ko' ? 'en_US' : 'ko_KR',
      title: meta.title,
      description: meta.description,
      siteName: 'Sudoku Online',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        'ko-KR': '/ko',
        'en-US': '/en',
        'ja-JP': '/jp',
      },
    },
  };
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;
  const locale = normalizeLocale(resolvedParams.locale);
  if (!locale) notFound();

  const messages = getMessages(locale);

  return (
    <I18nProvider locale={locale} messages={messages}>
      <header className="site-header">
        <nav className="site-nav" aria-label={messages.site.navAria}>
          <div className="site-brand">
            <span className="brand-chip">{messages.site.brandChip}</span>
            <span className="brand-title">{messages.site.brandTitle}</span>
          </div>
          <div className="site-actions">
            <span className="site-note">{messages.site.siteNote}</span>
            <LanguageSelect />
          </div>
        </nav>
      </header>

      <main id="main-content">
        <GameProvider>
          <GameContainer />
        </GameProvider>
      </main>

      <footer className="site-footer">
        <p>{messages.site.footerLine1}</p>
        <p className="site-footline">{messages.site.footerLine2}</p>
      </footer>
    </I18nProvider>
  );
}
