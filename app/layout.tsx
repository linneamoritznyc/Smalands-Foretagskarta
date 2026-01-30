import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Smålands Företagskarta - Regional Business Intelligence",
    template: "%s | Smålands Företagskarta",
  },
  description: "Se företag och tillväxt i din region - i realtid. Interaktiv dashboard för Jönköpings län med 35,000+ företag i 13 kommuner.",
  keywords: ["företag", "Småland", "Jönköping", "business intelligence", "regional utveckling", "statistik", "SCB", "Bolagsverket"],
  authors: [{ name: "Linnea Moritz", url: "https://linneamoritz.com" }],
  creator: "Linnea Moritz",
  metadataBase: new URL("https://smalands-foretagskarta.vercel.app"),
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Smålands Företagskarta",
    description: "Se företag och tillväxt i din region - i realtid. Regional business intelligence för Jönköpings län.",
    type: "website",
    locale: "sv_SE",
    siteName: "Smålands Företagskarta",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Smålands Företagskarta - Regional Business Intelligence Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Smålands Företagskarta",
    description: "Se företag och tillväxt i din region - i realtid",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.variable}>
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
