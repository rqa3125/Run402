"use client";

import { Search } from "lucide-react";

/**
 * Command/search entry point — UI only for this sprint. Styled like a real
 * search field with a ⌘K affordance; wiring lands in a later sprint.
 */
export function SearchBar() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-command-menu"))}
      className="hidden h-9 w-full max-w-xs items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:border-foreground/20 sm:flex"
      aria-label="Search"
    >
      <Search className="h-4 w-4" />
      <span className="flex-1 text-left">Search…</span>
      <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">
        ⌘K
      </kbd>
    </button>
  );
}
