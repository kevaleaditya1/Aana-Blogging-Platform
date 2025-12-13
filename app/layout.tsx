import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ashitya - Tech for the Future",
    template: "%s | Ashitya",
  },
  description: "Modern tech blogging: Smartphones, AI, Gadgets, and more. Stay updated with the latest tech news, reviews, and guides.",
  keywords: ["tech blog", "smartphones", "AI", "gadgets", "technology", "reviews", "guides"],
  authors: [{ name: "Ashitya" }],
  creator: "Ashitya",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    title: "Ashitya - Tech for the Future",
    description: "Modern tech blogging: Smartphones, AI, Gadgets, and more.",
    siteName: "Ashitya",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashitya - Tech for the Future",
    description: "Modern tech blogging: Smartphones, AI, Gadgets, and more.",
    creator: "@ashitya",
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={clsx(
          inter.variable,
          "antialiased min-h-screen bg-background text-foreground flex flex-col"
        )}
      >
        <GoogleAnalytics />
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
