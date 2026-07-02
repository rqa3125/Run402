"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@run402/ui";
import { primaryNav, type NavItem } from "./nav";

/** Fixed left navigation rail. Highlights the active route by prefix match. */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-muted/30 md:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            R
          </span>
          Run402
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {primaryNav.map((item) => (
          <SidebarLink key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="rounded-lg bg-background p-3 text-xs text-muted-foreground shadow-sm">
          <p className="font-medium text-foreground">You&apos;re on the Free plan</p>
          <p className="mt-0.5">Usage-based billing is coming soon.</p>
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const Icon = item.icon;

  if (item.comingSoon || !item.href) {
    return (
      <span
        aria-disabled
        className="flex cursor-default items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/60"
      >
        <Icon className="h-4 w-4" />
        <span className="flex-1">{item.label}</span>
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          Soon
        </span>
      </span>
    );
  }

  const active =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
      )}
    >
      <Icon className="h-4 w-4" />
      {item.label}
    </Link>
  );
}
