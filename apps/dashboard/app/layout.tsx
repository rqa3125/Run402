import {ClerkProvider} from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@run402/ui";

export const metadata: Metadata = {
  title: {
    default: "Run402 Dashboard",
    template: "%s · Run402",
  },
  description: "Manage your monetized APIs, projects, and billing.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <ClerkProvider>
          <Providers>
          {children}
          <Toaster />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}