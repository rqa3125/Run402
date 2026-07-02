import type { Metadata } from "next";
import Link from "next/link";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { DocsNav } from "@/components/docs-nav";

export const metadata: Metadata = {
  title: { default: "Run402 Docs", template: "%s · Run402 Docs" },
  description: "Documentation for Run402 — monetize any API.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        <div className="mx-auto flex max-w-6xl gap-10 px-6">
          <aside className="sticky top-0 hidden h-dvh w-52 shrink-0 overflow-y-auto py-8 md:block">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
                R
              </span>
              Run402 Docs
            </Link>
            <DocsNav />
          </aside>
          <main className="min-w-0 max-w-3xl flex-1 py-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
