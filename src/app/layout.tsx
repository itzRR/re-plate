import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RePlate – Smart Food Rescue & Redistribution Platform",
  description:
    "Connecting surplus food with people who need it before it becomes waste. Join RePlate to reduce food waste, feed communities, and save the planet.",
  keywords: [
    "food rescue",
    "food waste",
    "sustainability",
    "food donation",
    "community",
    "carbon footprint",
    "surplus food",
  ],
  openGraph: {
    title: "RePlate – Smart Food Rescue & Redistribution",
    description:
      "Connecting surplus food with people who need it before it becomes waste.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#0F172A] text-[#F8FAFC] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
