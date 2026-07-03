"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import { Menu, X, Command } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { nav, site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState<string | null>(null);
  const { scrollY } = useScroll();

  // Smoothly shrink the bar over the first 120px of scroll.
  const height = useTransform(scrollY, [0, 120], [72, 58]);
  const logoScale = useTransform(scrollY, [0, 120], [1, 0.92]);
  const railWidth = useTransform(scrollY, [0, 120], ["100%", "92%"]);
  const railRadius = useTransform(scrollY, [0, 120], [0, 999]);

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 8));

  const openCommand = () =>
    window.dispatchEvent(new CustomEvent("open-command-menu"));

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center">
      <motion.div
        style={{ width: railWidth, borderRadius: railRadius }}
        className={cn(
          "mt-0 max-w-[1240px] border-b transition-[background-color,border-color,box-shadow] duration-500",
          scrolled
            ? "border-border/80 bg-background/60 shadow-soft backdrop-blur-xl sm:mt-3 sm:border"
            : "border-transparent bg-transparent"
        )}
      >
        <motion.nav
          style={{ height }}
          className="container-edge flex items-center justify-between"
        >
          <motion.div style={{ scale: logoScale }} className="origin-left">
            <Link href="/" className="shrink-0" aria-label="Run402 home">
              <Logo />
            </Link>
          </motion.div>

          <div
            className="hidden items-center gap-1 md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHovered(item.label)}
                {...("external" in item && item.external
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="relative rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {hovered === item.label && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-muted"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openCommand}
              className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground lg:inline-flex"
              aria-label="Open command menu"
            >
              <Command className="h-3 w-3" />
              <span>K</span>
            </button>
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="hidden sm:inline-flex"
            >
              <Link href={site.dashboardUrl}>Sign in</Link>
            </Button>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/docs">Get Started</Link>
            </Button>
            <button
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </motion.nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-b border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container-edge flex flex-col gap-1 py-4">
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
              <Button asChild variant="ghost" className="mt-2 w-full">
                <Link href={site.dashboardUrl} onClick={() => setOpen(false)}>
                  Sign in
                </Link>
              </Button>
              <div className="mt-2 flex items-center gap-2">
                <Button asChild className="flex-1">
                  <Link href="/docs" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
