import type { Metadata } from "next";
import { Cinzel } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tarot-online.vercel.app"),
  title: {
    default: "Tarot Online - Xem bài Tarot trực tuyến",
    template: "%s | Tarot Online",
  },
  description: "Khám phá vận mệnh của bạn thông qua những lá bài Tarot cổ xưa. Rút bài, tra cứu ý nghĩa và tìm hiểu về Tarot.",
  keywords: ["tarot", "xem bói", "tarot online", "rút bài tarot", "ý nghĩa lá bài", "tarot việt nam", "xem bài tarot"],
  authors: [{ name: "Tarot Online" }],
  creator: "Tarot Online",
  publisher: "Tarot Online",
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
    locale: "vi_VN",
    url: "https://tarot-online.vercel.app",
    siteName: "Tarot Online",
    title: "Tarot Online - Xem bài Tarot trực tuyến",
    description: "Khám phá vận mệnh của bạn thông qua những lá bài Tarot cổ xưa. Rút bài, tra cứu ý nghĩa và tìm hiểu về Tarot.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Tarot Online",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarot Online - Xem bài Tarot trực tuyến",
    description: "Khám phá vận mệnh của bạn thông qua những lá bài Tarot cổ xưa",
    images: ["/og-image.png"],
    creator: "@tarotonline",
  },
  alternates: {
    canonical: "https://tarot-online.vercel.app",
    languages: {
      vi: "https://tarot-online.vercel.app",
    },
  },
  category: "lifestyle",
  classification: "Tarot Reading",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${cinzel.variable} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1 pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
