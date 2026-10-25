import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

// Special Elite (Apache 2.0), self-hosted: builds kept failing on flaky
// fetches to fonts.gstatic.com, and bundling kills that dependency for
// Vercel too.
const specialElite = localFont({
  src: "./fonts/SpecialElite.woff2",
  variable: "--font-elite",
  weight: "400",
  display: "swap",
  // Turbopack dev fails decompressing this woff2 when computing the
  // size-adjusted fallback ("get_font_fallbacks ... compression error").
  // Skip it and declare fallbacks by hand — it's a decorative font.
  adjustFontFallback: false,
  fallback: ["Courier New", "monospace"],
});

// Nanum Gothic Coding (OFL), self-hosted — Korean glyphs for the typewriter
// UI, so Korean text keeps the monospace vibe instead of falling back to a
// system font.
const nanumGothicCoding = localFont({
  src: "./fonts/NanumGothicCoding.ttf",
  variable: "--font-ngc",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["monospace"],
});

const SITE = "https://sigco3111.github.io/Backroom-Escape";

export const metadata: Metadata = {
  // Absolute base so og:image/twitter:image resolve for social scrapers.
  metadataBase: new URL(SITE),
  // Search-facing title (what people actually type: "backrooms game",
  // "browser horror game"). In-game branding stays BACKROOMS — LEVEL 0.
  title: "Backrooms: Level 0 — 무료 브라우저 호러 게임 (한국어판)",
  description:
    "백룸을 브라우저에서 무료로 플레이하세요. 절차적으로 생성되는 미로 속 1인칭 호러 — 페이지 8장을 찾아 레벨 0을 탈출하고, 걷는 소리를 들키지 마세요. 다운로드 불필요.",
  applicationName: "Backrooms: Level 0",
  // No author URL in the CG build — keeps every external link out of the bundle.
  authors:
    process.env.CG_EXPORT === "1"
      ? [{ name: "StarKnightt" }]
      : [{ name: "StarKnightt", url: "https://github.com/StarKnightt" }],
  creator: "StarKnightt",
  keywords: [
    "backrooms game",
    "backrooms",
    "백룸 게임",
    "백룸",
    "브라우저 호러 게임",
    "무료 호러 게임",
    "한국어 호러 게임",
    "play backrooms online",
    "browser horror game",
    "free horror game",
    "level 0",
    "liminal space game",
    "no download horror game",
    "three.js game",
    "procedural horror",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Backrooms: Level 0 — 무료 브라우저 호러 게임 (한국어판)",
    description:
      "현실 밖으로 노클립했습니다. 페이지 8장을 찾아 미로를 탈출하고, 걷는 소리를 들키지 마세요. 매번 세상에 없던 미로가 새로 만들어집니다.",
    url: "/",
    siteName: "Backrooms: Level 0",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    site: "@prasenx",
    creator: "@prasenx",
    title: "Backrooms: Level 0 — 무료 브라우저 호러 게임 (한국어판)",
    description:
      "현실 밖으로 노클립했습니다. 페이지 8장을 찾아 미로를 탈출하고, 걷는 소리를 들키지 마세요.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0905",
  colorScheme: "dark",
  // Game viewport: bleed under notches in fullscreen, no pinch/double-tap
  // zoom fighting the touch controls.
  viewportFit: "cover",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

// Structured data: lets Google show this as a game in rich results.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "VideoGame",
  name: "Backrooms: Level 0",
  url: SITE,
  image: `${SITE}/opengraph-image.png`,
  description:
    "브라우저에서 즐기는 무료 1인칭 호러 게임. 절차적으로 생성되는 백룸 미로를 탐험하고 페이지 8장을 모아 탈출하세요 — 소리로 당신을 쫓는 무언가가 있습니다.",
  genre: ["Horror", "Survival"],
  playMode: "SinglePlayer",
  gamePlatform: ["Web Browser"],
  applicationCategory: "Game",
  operatingSystem: "Any",
  inLanguage: "ko",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
  },
  author: {
    "@type": "Person",
    name: "StarKnightt",
    url: "https://github.com/StarKnightt",
    sameAs: ["https://x.com/prasenx", "https://github.com/StarKnightt"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${specialElite.variable} ${nanumGothicCoding.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden bg-black text-zinc-200">
        {/* SEO structured data — Vercel-only; useless inside the CG iframe
            and it carries external profile URLs their QA could flag */}
        {process.env.CG_EXPORT !== "1" && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
            }}
          />
        )}
        {children}
        {/* Vercel-only — the CrazyGames bundle would just spam 404s */}
        {process.env.CG_EXPORT !== "1" && <Analytics />}
      </body>
    </html>
  );
}
