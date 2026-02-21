import type { Metadata } from "next";
import "./globals.css";
import { cookies } from "next/headers";
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  getMessages,
  isSupportedLocale,
  type Locale,
} from "@/lib/i18n";

export const metadata: Metadata = {
  title: {
    default: "스도쿠 온라인 - 무료 스도쿠 퍼즐 게임 | Sudoku Online",
    template: "%s | 스도쿠 온라인",
  },
  description:
    "무료 온라인 스도쿠 퍼즐! Easy, Medium, Hard, Expert 4단계 난이도를 선택하고, 힌트와 메모 기능으로 스도쿠를 풀어보세요. 설치 없이 브라우저에서 바로 플레이!",
  keywords: [
    "스도쿠",
    "sudoku",
    "온라인 스도쿠",
    "무료 스도쿠",
    "스도쿠 퍼즐",
    "스도쿠 게임",
    "sudoku online",
    "sudoku puzzle",
    "free sudoku",
    "brain puzzle",
    "두뇌 게임",
  ],
  authors: [{ name: "Sudoku Online" }],
  creator: "Sudoku Online",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    title: "스도쿠 온라인 - 무료 스도쿠 퍼즐 게임",
    description:
      "쉬움~전문가까지 4단계 난이도! 설치 없이 브라우저에서 바로 플레이하세요.",
    siteName: "Sudoku Online",
  },
  twitter: {
    card: "summary_large_image",
    title: "스도쿠 온라인 - 무료 스도쿠 퍼즐 게임",
    description: "4단계 난이도 무료 온라인 스도쿠. 키보드 지원, 힌트, 메모 기능!",
  },
  metadataBase: new URL("https://sudoku.example.com"),
  alternates: {
    canonical: "/en",
    languages: {
      "ko-KR": "/ko",
      "en-US": "/en",
      "ja-JP": "/jp",
    },
  },
  other: {
    "google-adsense-account": "ca-pub-XXXXXXXXXXXXXXXX",
  },
};

// JSON-LD structured data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "스도쿠 온라인",
  alternateName: "Sudoku Online",
  url: "https://sudoku.example.com",
  description:
    "무료 온라인 스도쿠 퍼즐 게임. 4단계 난이도 선택, 힌트, 메모 기능 지원.",
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
  },
  browserRequirements: "Requires JavaScript. Requires HTML5.",
  softwareVersion: "1.0",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale: Locale = isSupportedLocale(cookieLocale) ? cookieLocale : DEFAULT_LOCALE;
  const messages = getMessages(locale);
  const htmlLang = locale === "jp" ? "ja" : locale;

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          {messages.site.skipLink}
        </a>
        {children}
      </body>
    </html>
  );
}
