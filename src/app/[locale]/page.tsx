import LanguageSelect from '@/components/LanguageSelect';
import GameContainer from '@/components/GameContainer';
import { GameProvider } from '@/lib/gameContext';
import { I18nProvider } from '@/lib/i18nContext';
import {
  getMessages,
  normalizeLocale,
  SUPPORTED_LOCALES,
} from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
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
