import type { Metadata } from "next";
import { Inter, Noto_Sans_Bengali } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jewelrinku.com.bd"),
  title: {
    default: "Jewel Rinku Enterprise | Manpower Recruitment Prototype",
    template: "%s | Jewel Rinku Enterprise",
  },
  description:
    "Frontend prototype for Jewel Rinku Enterprise, a Bangladesh manpower recruiting agency (Licence 1776). Demo vacancies are not live offers.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Jewel Rinku Enterprise",
    description:
      "Connecting Bangladeshi talent with global opportunities. Prototype website — not a live job board.",
    locale: "en_BD",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoBengali.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-canvas font-sans text-ink" suppressHydrationWarning>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
