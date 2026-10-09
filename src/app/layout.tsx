import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import { MotionProvider } from "@/components/motion/motion-provider";
import { normalizeSiteUrl } from "@/lib/seo";

import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = normalizeSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Arte Nativa | Dança, tradição e comunidade",
    template: "%s | Arte Nativa",
  },
  description: "Conheça as aulas, horários, locais e eventos da Arte Nativa.",
  applicationName: "Arte Nativa",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Arte Nativa",
    title: "Arte Nativa | Dança, tradição e comunidade",
    description: "Conheça as aulas, horários, locais e eventos da Arte Nativa.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arte Nativa | Dança, tradição e comunidade",
    description: "Conheça as aulas, horários, locais e eventos da Arte Nativa.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
