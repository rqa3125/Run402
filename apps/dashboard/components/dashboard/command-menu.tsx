"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  BookOpen,
  CreditCard,
  Database,
  FlaskConical,
  FolderKanban,
  LayoutDashboard,
  Moon,
  Plus,
  Search,
  Settings,
  Sun,
  CornerDownLeft,
} from "lucide-react";
import { cn } from "@run402/ui";

interface Item {
  group: string;
  label: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string;
}

interface ProjectLite {
  id: string;
  name: string;
}

/** ⌘K palette: navigate, run actions, jump to projects and docs. */
export function CommandMenu() {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const [projects, setProjects] = React.useState<ProjectLite[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "Escape") {
        close();
      }
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
    if (!open) return;
    setTimeout(() => inputRef.current?.focus(), 30);
    // Lazy-load projects for search (session-authed).
    fetch("/api/v1/projects")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((d: { items?: ProjectLite[] }) => setProjects(d.items ?? []))
      .catch(() => undefined);
  }, [open]);

  React.useEffect(() => setActive(0), [query]);

  const items = React.useMemo<Item[]>(() => {
    const go = (href: string) => () => {
      close();
      if (href.startsWith("http")) window.open(href, "_blank");
      else router.push(href);
    };
    const base: Item[] = [
      { group: "Navigation", label: "Overview", icon: LayoutDashboard, action: go("/dashboard") },
      { group: "Navigation", label: "Projects", icon: FolderKanban, action: go("/projects") },
      { group: "Navigation", label: "Playground", icon: FlaskConical, action: go("/playground") },
      { group: "Navigation", label: "API Explorer", icon: Database, action: go("/explorer") },
      { group: "Navigation", label: "Billing", icon: CreditCard, action: go("/billing") },
      { group: "Navigation", label: "Settings", icon: Settings, action: go("/settings") },
      { group: "Actions", label: "Create project", icon: Plus, action: go("/projects") },
      {
        group: "Actions",
        label: "Toggle theme",
        icon: resolvedTheme === "dark" ? Sun : Moon,
        action: () => {
          setTheme(resolvedTheme === "dark" ? "light" : "dark");
          close();
        },
        keywords: "dark light appearance",
      },
      { group: "Help", label: "Documentation", icon: BookOpen, action: go("http://localhost:3002"), keywords: "docs" },
    ];
    const projectItems: Item[] = projects.map((p) => ({
      group: "Projects",
      label: p.name,
      icon: FolderKanban,
      action: go(`/projects/${p.id}`),
      keywords: "project",
    }));
    return [...base, ...projectItems];
  }, [projects, resolvedTheme, router, close, setTheme]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) =>
      `${i.label} ${i.keywords ?? ""} ${i.group}`.toLowerCase().includes(q),
    );
  }, [items, query]);

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

  if (!open) return null;
  let lastGroup = "";

  return (
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={close} />
      <div className="absolute left-1/2 top-[16vh] w-[min(92vw,560px)] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onListKey}
            placeholder="Search projects, pages, actions…"
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-muted-foreground">
              No results.
            </p>
          )}
          {filtered.map((item, i) => {
            const showGroup = item.group !== lastGroup;
            lastGroup = item.group;
            return (
              <React.Fragment key={`${item.group}-${item.label}`}>
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
                    active === i ? "bg-muted text-foreground" : "text-muted-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  {active === i && <CornerDownLeft className="h-3.5 w-3.5 opacity-60" />}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
