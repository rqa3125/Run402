"use client";

import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Lock, Loader2, Check, RotateCcw, ArrowRight } from "lucide-react";
import { WindowDots } from "@/components/ui/code-block";
import { cn } from "@/lib/utils";

type Phase = "idle" | "requesting" | "blocked" | "paying" | "success";

const BLOCKED_BODY = `HTTP/1.1 402 Payment Required
content-type: application/json

{
  "error": "payment_required",
  "price": "$0.50",
  "checkout": "https://run402.com/pay/..."
}`;

const SUCCESS_BODY = `HTTP/1.1 200 OK
content-type: application/json

{
  "data": "🔓 premium unlocked",
  "credits": 1
}`;

/**
 * Interactive, replayable request → 402 → pay → 200 demo.
 * Used in the hero (autoPlay + loop) and the live-demo section (manual).
 */
export function PaymentFlow({
  autoPlay = false,
  loop = false,
  className,
}: {
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
}) {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const reduce = useReducedMotion();
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  const later = (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const request = React.useCallback(() => {
    setPhase("requesting");
    later(() => setPhase("blocked"), 900);
  }, []);

  const pay = React.useCallback(() => {
    setPhase("paying");
    later(() => setPhase("success"), 1100);
  }, []);

  const reset = React.useCallback(() => {
    clearTimers();
    setPhase("idle");
  }, []);

  // Autoplay loop for the hero — one self-scheduling cycle
  React.useEffect(() => {
    if (!autoPlay || reduce) return;
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      setPhase("idle");
      later(() => setPhase("requesting"), 1100);
      later(() => setPhase("blocked"), 2100);
      later(() => setPhase("paying"), 3600);
      later(() => setPhase("success"), 4700);
      if (loop) later(run, 7200);
    };
    run();
    return () => {
      cancelled = true;
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, loop, reduce]);

  const isLoading = phase === "requesting" || phase === "paying";
  const body = phase === "success" ? SUCCESS_BODY : BLOCKED_BODY;
  const showBody = phase === "blocked" || phase === "paying" || phase === "success";

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-glow",
        className
      )}
    >
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-4 py-3">
        <WindowDots />
        <div className="flex h-7 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 font-mono text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span className="truncate">api.yourapp.com/premium</span>
        </div>
      </div>

      <div className="space-y-4 p-5">
        {/* status pill */}
        <div className="flex items-center justify-between">
          <StatusPill phase={phase} />
          {phase === "success" && !autoPlay && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3 w-3" /> Replay
            </button>
          )}
        </div>

        {/* response body */}
        <div className="min-h-[168px] rounded-lg border border-border bg-muted/30 p-4">
          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.p
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-mono text-xs leading-relaxed text-muted-foreground"
              >
                <span className="text-foreground">GET</span> /premium
                <br />
                <span className="opacity-60">
                  → send a request to see the paywall
                </span>
              </motion.p>
            )}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full items-center gap-2 py-6 font-mono text-xs text-muted-foreground"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {phase === "requesting"
                  ? "requesting /premium…"
                  : "confirming payment…"}
              </motion.div>
            )}
            {showBody && !isLoading && (
              <motion.pre
                key={phase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-relaxed"
              >
                {body.split("\n").map((line, i) => (
                  <span
                    key={i}
                    className={cn(
                      "block",
                      i === 0 && phase === "success" && "text-emerald-500",
                      i === 0 && phase !== "success" && "text-orange-500"
                    )}
                  >
                    {line || " "}
                  </span>
                ))}
              </motion.pre>
            )}
          </AnimatePresence>
        </div>

        {/* action button */}
        <FlowButton phase={phase} onRequest={request} onPay={pay} auto={autoPlay} />
      </div>
    </div>
  );
}

function StatusPill({ phase }: { phase: Phase }) {
  const map = {
    idle: { label: "Ready", cls: "text-muted-foreground bg-muted" },
    requesting: { label: "200 · pending", cls: "text-muted-foreground bg-muted" },
    blocked: { label: "402 Payment Required", cls: "text-orange-600 bg-orange-500/10" },
    paying: { label: "Processing", cls: "text-muted-foreground bg-muted" },
    success: { label: "200 OK", cls: "text-emerald-600 bg-emerald-500/10" },
  }[phase];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium",
        map.cls
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {map.label}
    </span>
  );
}

function FlowButton({
  phase,
  onRequest,
  onPay,
  auto,
}: {
  phase: Phase;
  onRequest: () => void;
  onPay: () => void;
  auto?: boolean;
}) {
  const disabled = auto || phase === "requesting" || phase === "paying";

  if (phase === "blocked") {
    return (
      <button
        onClick={onPay}
        disabled={disabled}
        className="group flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-all hover:bg-foreground/90 disabled:opacity-70"
      >
        Pay $0.50 with Stripe
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    );
  }
  if (phase === "success") {
    return (
      <div className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-medium text-emerald-600">
        <Check className="h-4 w-4" /> Access granted
      </div>
    );
  }
  return (
    <button
      onClick={onRequest}
      disabled={disabled}
      className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border text-sm font-medium transition-colors hover:bg-muted disabled:opacity-70"
    >
      {phase === "requesting" ? "Requesting…" : "Send request"}
    </button>
  );
}
