import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/chatbot/chatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Aana - Tech for the Future",
    template: "%s | Aana",
  },
  description: "Modern tech blogging: Smartphones, AI, Gadgets, and more. Stay updated with the latest tech news, reviews, and guides.",
  keywords: ["tech blog", "smartphones", "AI", "gadgets", "technology", "reviews", "guides"],
  authors: [{ name: "Aana" }],
  creator: "Aana",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    title: "Aana - Tech for the Future",
    description: "Modern tech blogging: Smartphones, AI, Gadgets, and more.",
    siteName: "Aana",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aana - Tech for the Future",
    description: "Modern tech blogging: Smartphones, AI, Gadgets, and more.",
    creator: "@Aana",
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
      <head>
        <meta name="google-adsense-account" content="ca-pub-8999010834139123" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8999010834139123"
          crossOrigin="anonymous"
        ></script>
      </head>
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
            <Chatbot />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
