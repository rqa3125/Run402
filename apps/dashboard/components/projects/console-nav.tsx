"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Webhook,
  KeyRound,
  TerminalSquare,
  ScrollText,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@run402/ui";

interface Item {
  label: string;
  segment: string;
  icon: LucideIcon;
  comingSoon?: boolean;
}

const ITEMS: Item[] = [
  { label: "Overview", segment: "", icon: LayoutDashboard },
  { label: "Endpoints", segment: "endpoints", icon: Webhook },
  { label: "API Keys", segment: "keys", icon: KeyRound },
  { label: "Installation", segment: "installation", icon: TerminalSquare },
  { label: "Logs", segment: "logs", icon: ScrollText },
  { label: "Settings", segment: "settings", icon: Settings },
];

/** Project-scoped navigation. Vertical rail on desktop, scrollable on mobile. */
export function ConsoleNav({ projectId }: { projectId: string }) {
  const pathname = usePathname();
  const base = `/projects/${projectId}`;

  return (
    <nav className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 md:mx-0 md:flex-col md:overflow-visible md:px-0">
      {ITEMS.map((item) => {
        const href = item.segment ? `${base}/${item.segment}` : base;
        const active = item.segment
          ? pathname.startsWith(href)
          : pathname === base;

        if (item.comingSoon) {
          return (
            <span
              key={item.label}
              aria-disabled
              className="flex shrink-0 cursor-default items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/50"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              <span className="ml-auto hidden rounded-full bg-muted px-1.5 py-0.5 text-[10px] md:inline">
                Soon
              </span>
            </span>
          );
        }

        return (
          <Link
            key={item.label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
