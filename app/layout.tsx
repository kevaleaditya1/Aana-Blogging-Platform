import { PrivacyControls } from "@/components/privacy-controls";
import { MobileCTA } from "@/components/mobile-cta";
import { SITE_URL, pageMetadata } from "@/lib/site";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { clsx } from "clsx";
import { ThemeProvider } from "@/components/theme-provider";
import { SessionProvider } from "next-auth/react";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/chatbot/chatbot";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap", // Prevents invisible text during font load
  preload: true, // Preload font for faster rendering
  fallback: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"], // Fallback fonts
});

export const metadata: Metadata = {
  ...pageMetadata("Tech for the Future", "Smartphone reviews, gadget guides and AI insights. Explore Aana's latest technology articles.", "/"),
  metadataBase: new URL(SITE_URL),
  manifest: "/manifest.webmanifest",
  icons: { icon: [{ url: "/favicon.ico", sizes: "16x16 32x32 48x48" }], apple: [{ url: "/apple-icon.png", sizes: "180x180" }] },
  robots: { index: true, follow: true },
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
          "antialiased min-h-screen bg-background text-foreground flex flex-col relative selection:bg-primary/20 selection:text-primary"
        )}
      >
        {/* Ambient Liquid Glass Aurora Backdrop */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/12 dark:bg-primary/20 blur-[140px]" />
          <div className="absolute top-[35%] -left-36 w-[550px] h-[550px] rounded-full bg-purple-500/10 dark:bg-purple-600/15 blur-[150px]" />
          <div className="absolute -bottom-36 right-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 dark:bg-cyan-600/15 blur-[140px]" />
        </div>

        <a href="#main-content" className="skip-link">Skip to content</a>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <PrivacyControls>
            <Header />
            <main id="main-content" tabIndex={-1} className="flex-1 relative z-10">{children}</main>
            <Footer />
            <Chatbot />
            <MobileCTA />
            </PrivacyControls>
          </ThemeProvider>
        </SessionProvider>
      </body>

    </html>
  );
}
