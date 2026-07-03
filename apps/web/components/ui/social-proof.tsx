"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

type Entry = { name?: string; city: string; action: string };

// Realistic sample activity — rotates as gentle social proof during Public Beta.
const ENTRIES: Entry[] = [
  { name: "Rahul", city: "Bengaluru", action: "joined Public Beta" },
  { name: "Alex", city: "Berlin", action: "created their first API" },
  { name: "Sarah", city: "London", action: "joined the waitlist" },
  { city: "Singapore", action: "installed Run402" },
  { name: "Priya", city: "Mumbai", action: "protected an endpoint" },
  { name: "Chen", city: "Toronto", action: "joined Public Beta" },
  { name: "Marco", city: "Amsterdam", action: "created their first API" },
  { name: "Aisha", city: "Dubai", action: "joined the waitlist" },
  { name: "Liam", city: "Sydney", action: "installed Run402" },
  { name: "Diego", city: "São Paulo", action: "protected an endpoint" },
  { name: "Yuki", city: "Tokyo", action: "joined Public Beta" },
  { name: "Omar", city: "Cairo", action: "created their first project" },
];

const FIRST_DELAY = 9_000; // let the page settle before the first toast
const VISIBLE_MS = 5_200; // how long each toast stays
const FADE_MS = 450; // fade in/out duration

export function SocialProof() {
  const [entry, setEntry] = React.useState<Entry | null>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    let i = Math.floor(Math.random() * ENTRIES.length);
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    const showOne = () => {
      setEntry(ENTRIES[i % ENTRIES.length]);
      i += 1;
      setShow(false); // mount hidden…
      t(() => setShow(true), 40); // …then fade in on the next frame
      t(() => {
        setShow(false); // fade out
        t(() => {
          setEntry(null);
          // Next toast appears every ~45–60s.
          t(showOne, 40_000 + Math.random() * 15_000);
        }, FADE_MS);
      }, VISIBLE_MS);
    };

    t(showOne, FIRST_DELAY);
    return () => timers.forEach(clearTimeout);
  }, []);

  if (!entry) return null;
  const subject = entry.name ?? "A developer";

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 max-w-[calc(100vw-2rem)]">
      <div
        className={cn(
          "pointer-events-auto flex items-center gap-3 rounded-2xl border border-border bg-background/90 py-2 pl-2 pr-4 shadow-soft backdrop-blur-md transition-all ease-out",
          show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
        )}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      >
        <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-[13px] font-semibold text-foreground/80">
          {entry.name ? (
            entry.name.charAt(0)
          ) : (
            <Globe className="h-4 w-4 text-muted-foreground" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-500 animate-beta-glow" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] leading-tight text-foreground">
            <span className="font-semibold">{subject}</span> from {entry.city}{" "}
            {entry.action}
          </p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            just now &middot; Public Beta
          </p>
        </div>
      </div>
    </div>
  );
}
