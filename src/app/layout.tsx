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
  title: "Tarot Online - Xem bài Tarot trực tuyến",
  description: "Khám phá vận mệnh của bạn thông qua những lá bài Tarot cổ xưa. Rút bài, tra cứu ý nghĩa và tìm hiểu về Tarot.",
  keywords: "tarot, xem bói, tarot online, rút bài tarot, ý nghĩa lá bài",
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
