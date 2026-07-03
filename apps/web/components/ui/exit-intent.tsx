"use client";

import * as React from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

const STORAGE_KEY = "run402_exit_intent_v1";
const ARM_DELAY = 3_000; // don't listen until the page has settled

export function ExitIntent() {
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const dismiss = React.useCallback(() => {
    setShow(false);
    window.setTimeout(() => setOpen(false), 250);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    // Trigger once, ever — respect a permanent dismissal.
    if (localStorage.getItem(STORAGE_KEY)) return;

    const trigger = () => {
      localStorage.setItem(STORAGE_KEY, "1");
      document.removeEventListener("mouseout", onMouseOut);
      setOpen(true);
      requestAnimationFrame(() => setShow(true));
    };

    // Cursor leaving toward the top browser chrome (tabs / address bar).
    const onMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !e.relatedTarget) trigger();
    };

    const armTimer = window.setTimeout(() => {
      document.addEventListener("mouseout", onMouseOut);
    }, ARM_DELAY);

    return () => {
      window.clearTimeout(armTimer);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  // Close on Escape while open.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center p-4 transition-opacity duration-300",
        show ? "opacity-100" : "opacity-0"
      )}
    >
      {/* backdrop */}
      <button
        aria-label="Close"
        tabIndex={-1}
        onClick={dismiss}
        className="absolute inset-0 h-full w-full cursor-default bg-foreground/40 backdrop-blur-sm"
      />

      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl border border-border bg-background p-8 text-center shadow-2xl transition-all duration-300 ease-out",
          show ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        )}
      >
        <button
          aria-label="Close"
          onClick={dismiss}
          className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-beta-glow" />
          Early Access
        </span>

        <h2
          id="exit-intent-title"
          className="mt-5 text-2xl font-semibold tracking-[-0.02em] sm:text-3xl"
        >
          Wait! You&rsquo;re early.
        </h2>

        <p className="mx-auto mt-3 max-w-sm text-pretty text-[15px] leading-relaxed text-muted-foreground">
          You&rsquo;re one of the first developers discovering Run402. Reserve
          your Public Beta access before launch.
        </p>

        <div className="mt-7 flex flex-col gap-2.5">
          <Button asChild size="lg" onClick={dismiss}>
            <Link href={site.dashboardUrl}>Reserve My Spot</Link>
          </Button>
          <Button variant="ghost" onClick={dismiss}>
            No Thanks
          </Button>
        </div>
      </div>
    </div>
  );
}
