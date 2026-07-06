"use client";

import * as React from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRight,
  Check,
  Loader2,
  Lock,
  Terminal as TerminalIcon,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { CopyButton } from "@/components/ui/copy-button";
import { WindowDots } from "@/components/ui/code-block";
import { FloatingShapes } from "@/components/ui/floating-shapes";
import { cn } from "@/lib/utils";
import { EASE_OUT } from "@/lib/motion";

/* -------------------------------------------------------------------------- */
/*  Director — one clock drives terminal, editor, browser and the step rail.  */
/* -------------------------------------------------------------------------- */

type Phase =
  | "install"
  | "installed"
  | "protect"
  | "ready"
  | "request"
  | "blocked"
  | "paying"
  | "success";

const SEQUENCE: [Phase, number][] = [
  ["install", 2200],
  ["installed", 1100],
  ["protect", 2600],
  ["ready", 900],
  ["request", 1100],
  ["blocked", 2000],
  ["paying", 1300],
  ["success", 2400],
];

const phaseIndex = (p: Phase) => SEQUENCE.findIndex((s) => s[0] === p);

function useDirector() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = React.useState(0);

  React.useEffect(() => {
    if (reduce) {
      setIdx(phaseIndex("success"));
      return;
    }
    const [, dur] = SEQUENCE[idx];
    const t = setTimeout(
      () => setIdx((i) => (i + 1) % SEQUENCE.length),
      dur
    );
    return () => clearTimeout(t);
  }, [idx, reduce]);

  const jumpTo = React.useCallback((p: Phase) => setIdx(phaseIndex(p)), []);
  return { phase: SEQUENCE[idx][0], jumpTo, reduce };
}

/** Types `text` once when `active`, resets when it goes inactive. */
function useTyped(text: string, active: boolean, speed = 32) {
  const reduce = useReducedMotion();
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    if (!active) {
      setN(0);
      return;
    }
    if (reduce) {
      setN(text.length);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [active, text, speed, reduce]);
  return text.slice(0, n);
}

const stepOf = (p: Phase): 1 | 2 | 3 =>
  p === "install" || p === "installed"
    ? 1
    : p === "protect" || p === "ready"
      ? 2
      : 3;

const Cursor = () => (
  <span className="ml-0.5 inline-block h-[1.05em] w-[7px] translate-y-[2px] animate-pulse bg-current align-middle" />
);

/* -------------------------------------------------------------------------- */
/*  Sub-panels                                                                */
/* -------------------------------------------------------------------------- */

function Panel({
  active,
  className,
  children,
}: {
  active: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{
        scale: active ? 1 : 0.985,
        opacity: active ? 1 : 0.9,
      }}
      transition={{ duration: 0.5, ease: EASE_OUT }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-card backdrop-blur-xl transition-[box-shadow,border-color] duration-500",
        active
          ? "border-foreground/15 shadow-glow"
          : "border-border shadow-soft",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

function PanelBar({
  label,
  active,
  icon,
}: {
  label: string;
  active: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-border/80 bg-muted/40 px-4 py-2.5">
      <WindowDots />
      <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
        {icon}
        {label}
      </span>
      {active && (
        <motion.span
          layoutId="panel-live"
          className="ml-auto flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-500"
        >
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          live
        </motion.span>
      )}
    </div>
  );
}

function TerminalCard({ phase }: { phase: Phase }) {
  const active = phase === "install" || phase === "installed";
  const typed = useTyped("npm install run402", phase === "install");
  const done = phase !== "install";

  return (
    <Panel active={active} className="w-full">
      <PanelBar
        label="terminal"
        active={phase === "install"}
        icon={<TerminalIcon className="h-3 w-3" />}
      />
      <div className="space-y-1 p-4 font-mono text-[12.5px] leading-relaxed">
        <div>
          <span className="text-muted-foreground/60">$ </span>
          {done ? "npm install run402" : typed}
          {phase === "install" && <Cursor />}
        </div>
        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-0.5 text-muted-foreground"
            >
              <div>
                <span className="text-emerald-500">+</span> run402@1.4.0
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500">
                <Check className="h-3 w-3" /> added 1 package in 0.9s
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Panel>
  );
}

const EDITOR_BODY = `app.use("/premium", protect({
  price: "$0.50",
}))`;

function EditorCard({ phase }: { phase: Phase }) {
  const active = phase === "protect" || phase === "ready";
  const typing = phase === "protect";
  const typed = useTyped(EDITOR_BODY, typing, 26);
  const showFull = ["ready", "request", "blocked", "paying", "success"].includes(
    phase
  );
  const body = typing ? typed : showFull ? EDITOR_BODY : "";

  return (
    <Panel active={active} className="w-full">
      <PanelBar label="server.ts" active={typing} icon={<Zap className="h-3 w-3" />} />
      <div className="p-4 font-mono text-[12.5px] leading-relaxed">
        <div className="text-muted-foreground">
          {"import { "}
          <span className="text-foreground">protect</span>
          {' } from "run402"'}
        </div>
        <div className="h-2" />
        {body ? (
          <pre className="whitespace-pre-wrap">
            {body.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line.includes("price") ? (
                  <>
                    {"  price: "}
                    <span className="text-emerald-600 dark:text-emerald-400">
                      &quot;$0.50&quot;
                    </span>
                    ,
                  </>
                ) : (
                  line
                )}
              </span>
            ))}
            {typing && <Cursor />}
          </pre>
        ) : (
          <span className="text-muted-foreground/50">
            {"// wrap any route to charge for it"}
          </span>
        )}
      </div>
    </Panel>
  );
}

const RES_402 = [
  { t: "HTTP/1.1 402 Payment Required", c: "text-orange-500" },
  { t: "x-run402-price: $0.50", c: "text-muted-foreground" },
  { t: "", c: "" },
  { t: '{ "checkout": "stripe.com/pay/..." }', c: "" },
];
const RES_200 = [
  { t: "HTTP/1.1 200 OK", c: "text-emerald-500" },
  { t: "x-run402-status: paid", c: "text-muted-foreground" },
  { t: "", c: "" },
  { t: '{ "data": "🔓 premium unlocked" }', c: "" },
];

function BrowserCard({
  phase,
  onPay,
}: {
  phase: Phase;
  onPay: () => void;
}) {
  const active = ["request", "blocked", "paying", "success"].includes(phase);
  const loading = phase === "request" || phase === "paying";
  const body = phase === "success" ? RES_200 : RES_402;
  const showBody =
    phase === "blocked" || phase === "paying" || phase === "success";

  const statusPill = {
    label:
      phase === "success"
        ? "200 OK"
        : phase === "blocked"
          ? "402 Payment Required"
          : phase === "paying"
            ? "Processing"
            : "Awaiting request",
    cls:
      phase === "success"
        ? "text-emerald-600 bg-emerald-500/10"
        : phase === "blocked"
          ? "text-orange-600 bg-orange-500/10"
          : "text-muted-foreground bg-muted",
  };

  return (
    <Panel active={active} className="w-full">
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-border/80 bg-muted/40 px-4 py-3">
        <WindowDots />
        <div className="flex h-7 flex-1 items-center gap-2 rounded-md border border-border bg-background px-3 font-mono text-[11px] text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span className="truncate">api.yourapp.com/premium</span>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[11px] font-medium",
              statusPill.cls
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {statusPill.label}
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            GET /premium
          </span>
        </div>

        <div className="min-h-[104px] rounded-lg border border-border bg-muted/30 p-3.5">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 py-8 font-mono text-[11px] text-muted-foreground"
              >
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {phase === "request"
                  ? "requesting /premium…"
                  : "confirming payment with Stripe…"}
              </motion.div>
            ) : showBody ? (
              <motion.pre
                key={phase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed"
              >
                {body.map((line, i) => (
                  <span key={i} className={cn("block", line.c)}>
                    {line.t || " "}
                  </span>
                ))}
              </motion.pre>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center font-mono text-[11px] text-muted-foreground/70"
              >
                endpoint protected — awaiting first request
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* action row */}
        <div className="h-10">
          <AnimatePresence mode="wait">
            {phase === "blocked" && (
              <motion.button
                key="pay"
                onClick={onPay}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                whileTap={{ scale: 0.98 }}
                className="group flex h-10 w-full items-center justify-center gap-2 rounded-full bg-foreground text-[13px] font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Pay $0.50 with Stripe
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            )}
            {phase === "success" && (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-[13px] font-medium text-emerald-600"
              >
                <Check className="h-4 w-4" /> Access granted
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  );
}

function RevenueToast({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9, transition: { duration: 0.25 } }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
          className="flex items-center gap-3 rounded-2xl border border-border bg-background/90 p-3 pr-4 shadow-glow backdrop-blur-xl"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
            <Check className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-semibold tabular-nums">+$0.50</div>
            <div className="text-[11px] text-muted-foreground">
              payment received
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* -------------------------------------------------------------------------- */
/*  Step rail                                                                 */
/* -------------------------------------------------------------------------- */

const STEPS = [
  { n: 1, label: "Install" },
  { n: 2, label: "Protect" },
  { n: 3, label: "Get paid" },
] as const;

function StepRail({ phase }: { phase: Phase }) {
  const current = stepOf(phase);
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((s, i) => {
        const state =
          s.n < current ? "done" : s.n === current ? "active" : "todo";
        return (
          <React.Fragment key={s.n}>
            <div className="flex items-center gap-2">
              <motion.span
                animate={{
                  scale: state === "active" ? 1 : 0.9,
                }}
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-semibold transition-colors duration-300",
                  state === "done" &&
                    "border-foreground bg-foreground text-background",
                  state === "active" &&
                    "border-foreground text-foreground",
                  state === "todo" &&
                    "border-border text-muted-foreground"
                )}
              >
                {state === "done" ? <Check className="h-3 w-3" /> : s.n}
              </motion.span>
              <span
                className={cn(
                  "text-xs font-medium transition-colors duration-300",
                  state === "todo"
                    ? "text-muted-foreground"
                    : "text-foreground"
                )}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="relative mx-1 h-px w-6 overflow-hidden bg-border sm:w-10">
                <motion.span
                  className="absolute inset-0 origin-left bg-foreground"
                  animate={{ scaleX: s.n < current ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Floating code snippets                                                    */
/* -------------------------------------------------------------------------- */

const SNIPPETS = [
  { t: "x-run402: paid", cls: "left-[7%] top-[-0.6rem]", d: 7, delay: 0 },
  { t: "HTTP 402", cls: "right-[7%] top-[-0.75rem]", d: 9, delay: 1.2 },
  { t: "stripe.checkout()", cls: "right-[1%] top-[45%]", d: 8, delay: 0.6 },
  { t: "revenue += $0.50", cls: "left-[12%] bottom-[-0.75rem]", d: 10, delay: 1.8 },
];

function FloatingSnippets() {
  const reduce = useReducedMotion();
  return (
    <div className="pointer-events-none absolute inset-0 z-40 hidden lg:block" aria-hidden>
      {SNIPPETS.map((s, i) => (
        <motion.span
          key={i}
          className={cn(
            "absolute rounded-lg border border-border bg-background/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground shadow-soft backdrop-blur",
            s.cls
          )}
          initial={{ opacity: 0, y: 8 }}
          animate={
            reduce
              ? { opacity: 1 }
              : { opacity: 1, y: [0, -10, 0] }
          }
          transition={{
            opacity: { duration: 1, delay: 0.6 + i * 0.15 },
            y: {
              duration: s.d,
              repeat: Infinity,
              ease: "easeInOut",
              delay: s.delay,
            },
          }}
        >
          {s.t}
        </motion.span>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero                                                                      */
/* -------------------------------------------------------------------------- */

const copyItem = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

export function Hero() {
  const { phase, jumpTo } = useDirector();
  const contractAddress = "JC42NKZnR4fj1ot2zDftRmW6tLZyJnT1BqAxqofBAory";

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28 sm:pt-32">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_75%_65%_at_50%_35%,black,transparent)]" />
      <FloatingShapes
        shapes={[
          { className: "left-[6%] top-[14%] h-72 w-72 bg-foreground/[0.05]", duration: 15, drift: 34 },
          { className: "right-[4%] top-[10%] h-80 w-80 bg-foreground/[0.04]", duration: 19, delay: 1.5, drift: 44 },
          { className: "left-[38%] bottom-[6%] h-64 w-64 bg-foreground/[0.03]", duration: 17, delay: 0.8, drift: 26 },
        ]}
      />

      <div className="container-edge relative w-full">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10">
          {/* -------------------------------- copy -------------------------------- */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } } }}
          >
            <motion.div
              variants={copyItem}
              className="flex flex-wrap items-center gap-2"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">
                  4
                </span>
                API infrastructure for the next generation
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600 backdrop-blur dark:text-emerald-400">
                Launching in Public <span aria-hidden>🚀</span>
              </span>
            </motion.div>

            <motion.h1
              variants={copyItem}
              className="mt-6 text-balance text-[3.25rem] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-7xl lg:text-[5.4rem]"
            >
              Monetize any
              <br />
              API in{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">one line</span>
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.7 }}
                  className="absolute inset-x-0 bottom-1.5 z-0 h-3 origin-left rounded-sm bg-foreground/10"
                />
              </span>
              <span className="text-muted-foreground">.</span>
            </motion.h1>

            <motion.p
              variants={copyItem}
              className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground"
            >
              Wrap a route, set a price, and start charging. Run402 handles
              Stripe Checkout, the 402 handshake, billing, and analytics — no
              payment code required.
            </motion.p>

            <motion.div
              variants={copyItem}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Magnetic strength={0.3}>
                <Button asChild size="lg">
                  <Link href="/docs">
                    Start building
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                  </Link>
                </Button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/docs">Read the docs</Link>
                </Button>
              </Magnetic>
            </motion.div>

            <motion.p
              variants={copyItem}
              className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground"
            >
              Join the first developers shaping the future of API monetization.
            </motion.p>

            <motion.div
              variants={copyItem}
              className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center"
            >
              <div className="group flex items-center justify-between gap-3 rounded-full border border-border bg-muted/40 py-2 pl-4 pr-2 font-mono text-sm transition-colors hover:border-foreground/20">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <TerminalIcon className="h-3.5 w-3.5" />
                  <span>
                    <span className="text-muted-foreground/60">$</span> npm
                    install run402
                  </span>
                </span>
                <CopyButton value="npm install run402" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-beta-glow" />
                <span className="font-medium text-foreground">Public Beta</span>
                <span aria-hidden className="text-muted-foreground/50">
                  •
                </span>
                <span>Early Access Open</span>
              </div>
            </motion.div>

            <motion.div variants={copyItem} className="mt-3">
              <div
                title={contractAddress}
                className="group inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-muted/40 py-1.5 pl-3 pr-1.5 transition-colors hover:border-foreground/20"
              >
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/70">
                  CA
                </span>
                <span className="truncate font-mono text-xs text-foreground/90">
                  {contractAddress.slice(0, 6)}…{contractAddress.slice(-6)}
                </span>
                <CopyButton value={contractAddress} />
              </div>
            </motion.div>
          </motion.div>

          {/* ------------------------------- scene -------------------------------- */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.25 }}
          >
            <div className="mb-6 flex justify-start lg:justify-end">
              <StepRail phase={phase} />
            </div>

            <div className="relative">
              <FloatingSnippets />

              {/* stacked on mobile, layered composition on desktop */}
              <div className="relative flex flex-col gap-4 lg:block lg:h-[492px]">
                <div className="lg:absolute lg:left-[-4%] lg:top-0 lg:z-10 lg:w-[52%]">
                  <TerminalCard phase={phase} />
                </div>

                <div className="lg:absolute lg:bottom-0 lg:left-[-4%] lg:z-10 lg:w-[55%]">
                  <EditorCard phase={phase} />
                </div>

                <div className="lg:absolute lg:right-0 lg:top-1/2 lg:z-30 lg:w-[70%] lg:-translate-y-1/2">
                  <BrowserCard phase={phase} onPay={() => jumpTo("paying")} />
                </div>
              </div>

              {/* revenue toast */}
              <div className="absolute right-2 top-2 z-40 lg:-right-4 lg:-top-6">
                <RevenueToast show={phase === "success"} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-9 w-6 items-start justify-center rounded-full border border-border p-1.5"
        >
          <span className="h-2 w-1 rounded-full bg-muted-foreground" />
        </motion.div>
      </motion.div>
    </section>
  );
}
