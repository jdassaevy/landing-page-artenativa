import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arte Nativa",
  description: "Danças tradicionais, cultura e comunidade.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
