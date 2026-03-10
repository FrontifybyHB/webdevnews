import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Playfair_Display, DM_Sans } from "next/font/google";
import Providers from "./providers";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

// ── Base URL — apna domain yahan dalo ──────────────────────────────────────
const BASE_URL = "https://webdevnewss.vercel.app"; // 👈 production domain se replace karo

// ── Metadata ───────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  // ── Core ──────────────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default: "WebDev Times — Aaj Ki Web Dev & AI Khabrein",
    template: "%s | WebDev Times",
  },
  description:
    "Web Development aur AI ki duniya ki taza khabar — har din, har update. React, Next.js, AI tools, Gemini, GPT, Claude — sab ek jagah. Indian developers ke liye.",
  keywords: [
    "web development news",
    "AI tools for developers",
    "Next.js news",
    "React updates 2026",
    "developer news India",
    "Gemini AI news",
    "GPT news Hindi",
    "tech news India",
    "AI coding tools",
    "frontend news",
    "backend news",
    "full stack developer news",
    "Cursor AI",
    "Windsurf IDE",
    "Claude AI news",
    "web dev Hindi",
    "WebDev Times",
    "hinglish tech news",
    "Indian developer blog",
  ],
  authors: [{ name: "WebDev Times", url: BASE_URL }],
  creator: "WebDev Times",
  publisher: "WebDev Times",
  category: "Technology",
  applicationName: "WebDev Times",
  generator: "Next.js",

  // ── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/",
    },
  },

  // ── Open Graph (Facebook, LinkedIn, WhatsApp) ─────────────────────────────
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "WebDev Times",
    title: "WebDev Times — Aaj Ki Web Dev & AI Khabrein",
    description:
      "Web Development aur AI ki duniya ki taza khabar — har din, har update. Indian developers ke liye, unki hi bhasha mein.",
    images: [
      {
        url: "/og-image.png",       // 👈 /public/og-image.png banao — 1200x630px
        width: 1200,
        height: 630,
        alt: "WebDev Times — Aaj Ki Tech Khabrein",
        type: "image/png",
      },
    ],
  },

  // ── Twitter / X Card ──────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    site: "@webdevtimes",         // 👈 apna Twitter handle dalo
    creator: "@webdevtimes",
    title: "WebDev Times — Aaj Ki Web Dev & AI Khabrein",
    description:
      "Real-time web dev & AI news for Indian developers — Hinglish mein, powered by Gemini AI.",
    images: ["/og-image.png"],
  },

  // ── Robots / Crawling ─────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Verification (Search Console mein milega) ─────────────────────────────
  verification: {
    google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",   // 👈 Google Search Console se
    // yandex: "YOUR_YANDEX_TOKEN",               // optional
  },

  // ── Icons ─────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: "/logo.webp", sizes: "any", type: "image/webp" },
    ],
    apple: [
      { url: "/logo.webp", sizes: "180x180", type: "image/webp" },
    ],
    shortcut: "/logo.webp",
  },

  // ── Manifest (PWA support) ────────────────────────────────────────────────
  manifest: "/manifest.json",   // 👈 /public/manifest.json banao (optional but good)
};

// ── JSON-LD Structured Data (Google rich results ke liye) ──────────────────
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      url: BASE_URL,
      name: "WebDev Times",
      description:
        "Web Development aur AI ki duniya ki taza khabar — har din, har update.",
      publisher: { "@id": `${BASE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${BASE_URL}/news?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: ["en-IN", "hi-IN"],
    },
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "WebDev Times",
      url: BASE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.webp`,
        width: 192,
        height: 192,
      },
      sameAs: [
        "https://twitter.com/webdevtimes",   // 👈 apne actual social links
        "https://github.com/webdevtimes",
      ],
    },
    {
      "@type": "NewsMediaOrganization",
      "@id": `${BASE_URL}/#newsorg`,
      name: "WebDev Times",
      url: BASE_URL,
      foundingDate: "2026",
      description:
        "Indian web developers ke liye real-time AI-powered tech news platform.",
      publishingPrinciples: `${BASE_URL}/about`,
      masthead: `${BASE_URL}/about`,
    },
  ],
};

// ── Root Layout ────────────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-IN"
      className={`${playfair.variable} ${dmSans.variable}`}
    >
      <head>
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Preconnect — Google Fonts speed */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Geo targeting — Indian audience ke liye */}
        <meta name="geo.region" content="IN" />
        <meta name="geo.placename" content="India" />
        <meta name="language" content="English, Hindi" />
        <meta name="target_country" content="India" />

        {/* Theme color — browser UI match kare */}
        <meta name="theme-color" content="#07070e" />
        <meta name="msapplication-TileColor" content="#07070e" />
        <meta name="msapplication-navbutton-color" content="#07070e" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="WebDev Times" />

        {/* Viewport — mobile-first */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />

        {/* Security */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="origin-when-cross-origin" />
      </head>
      <body
        style={{ fontFamily: "var(--font-dm-sans), sans-serif" }}
        className="antialiased bg-[#07070e] text-white"
      >
        <Providers>{children}</Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}