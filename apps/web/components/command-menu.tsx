"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  FileText,
  CreditCard,
  Home,
  Newspaper,
  GitBranch,
  Mail,
  Github,
  Moon,
  Sun,
  CornerDownLeft,
} from "lucide-react";
import { useTheme } from "next-themes";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type Item = {
  group: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string;
};

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const items = React.useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      close();
      if (href.startsWith("http")) window.open(href, "_blank");
      else router.push(href);
    };
    return [
      { group: "Navigation", label: "Home", icon: Home, action: go("/") },
      { group: "Navigation", label: "Documentation", icon: FileText, action: go("/docs") },
      { group: "Navigation", label: "Pricing", icon: CreditCard, action: go("/pricing") },
      { group: "Navigation", label: "Blog", icon: Newspaper, action: go("/blog") },
      { group: "Navigation", label: "Changelog", icon: GitBranch, action: go("/changelog") },
      { group: "Navigation", label: "Contact", icon: Mail, action: go("/contact") },
      { group: "Links", label: "GitHub Repository", icon: Github, action: go(site.github), keywords: "source code" },
      {
        group: "Theme",
        label: "Toggle dark mode",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        action: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          close();
        },
        keywords: "theme light appearance",
      },
    ];
  }, [router, close, resolvedTheme, setTheme]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) =>
      `${it.label} ${it.keywords ?? ""} ${it.group}`.toLowerCase().includes(q)
    );
  }, [items, query]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-menu", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-menu", onOpen);
    };
  }, [close]);

  React.useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  React.useEffect(() => setActive(0), [query]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[active]?.action();
    }
  };

  let lastGroup = "";

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
          <motion.div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-1/2 top-[18vh] w-[min(92vw,560px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-glow"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onListKey}
                placeholder="Search pages, docs, actions…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ESC
              </kbd>
            </div>
            <div className="max-h-[320px] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No results found.
                </p>
              )}
              {filtered.map((item, i) => {
                const showGroup = item.group !== lastGroup;
                lastGroup = item.group;
                return (
                  <React.Fragment key={item.label}>
                    {showGroup && (
                      <p className="px-3 pb-1 pt-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                        {item.group}
                      </p>
                    )}
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={item.action}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        active === i
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="flex-1">{item.label}</span>
                      {active === i && (
                        <CornerDownLeft className="h-3.5 w-3.5 opacity-60" />
                      )}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
