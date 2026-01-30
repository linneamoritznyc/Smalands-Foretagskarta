import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Smålands Företagskarta - Regional Business Intelligence",
  description: "Se företag och tillväxt i din region - i realtid. Interaktiv dashboard för Jönköpings län.",
  keywords: ["företag", "Småland", "Jönköping", "business intelligence", "regional utveckling", "statistik"],
  authors: [{ name: "Linnea Moritz", url: "https://linneamoritz.com" }],
  openGraph: {
    title: "Smålands Företagskarta",
    description: "Regional business intelligence för Jönköpings län",
    type: "website",
    locale: "sv_SE",
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
      </body>
    </html>
  );
}
