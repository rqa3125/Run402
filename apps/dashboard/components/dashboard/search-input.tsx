"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@run402/ui";

/**
 * Client-side search field. Focusable with "/". Purely filters in-memory data.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={cn(
        "flex h-9 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm",
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      ) : (
        <kbd className="hidden rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground sm:inline">
          /
        </kbd>
      )}
    </div>
  );
}
