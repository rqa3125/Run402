"use client";

import * as React from "react";
import { Check, Loader2, Play, RotateCcw } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  toast,
} from "@run402/ui";
import { markOnboarding } from "@/lib/onboarding";

type Status = "idle" | "running" | "done";

const STEP_DELAY = 850;

export function TestIntegration({
  projectId,
  defaultPath = "/api/premium",
}: {
  projectId: string;
  defaultPath?: string;
}) {
  const [status, setStatus] = React.useState<Status>("idle");
  const [step, setStep] = React.useState(0);
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const steps = [
    { title: "Incoming request", sub: `GET ${defaultPath}`, tone: "neutral" as const },
    { title: "402 Payment Required", sub: "Run402 intercepts the request", tone: "warn" as const },
    { title: "Payment approved", sub: "Sandbox · mock payment", tone: "neutral" as const },
    { title: "200 OK", sub: "Original request replayed", tone: "success" as const },
  ];

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStatus("running");
    setStep(0);
    for (let i = 1; i <= steps.length; i++) {
      timers.current.push(
        setTimeout(() => {
          setStep(i);
          if (i === steps.length) {
            setStatus("done");
            markOnboarding(projectId, "tested");
            toast.success("Test passed — 200 OK");
          }
        }, STEP_DELAY * i),
      );
    }
  };

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            Test integration
            <Badge variant="secondary">Sandbox</Badge>
          </CardTitle>
          <CardDescription className="mt-1">
            Simulate the full 402 payment flow end-to-end. No real charge.
          </CardDescription>
        </div>
        <Button size="sm" variant={status === "idle" ? "default" : "outline"} onClick={run}>
          {status === "idle" ? (
            <>
              <Play className="h-4 w-4" /> Test integration
            </>
          ) : (
            <>
              <RotateCcw className="h-4 w-4" /> Run again
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <ol className="relative space-y-0">
          {steps.map((s, i) => {
            const state =
              status === "idle"
                ? "pending"
                : i < step
                  ? "done"
                  : i === step && status === "running"
                    ? "running"
                    : "pending";
            const isLast = i === steps.length - 1;
            return (
              <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    className={cn(
                      "absolute left-[15px] top-8 h-full w-px transition-colors",
                      i < step ? "bg-foreground" : "bg-border",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors",
                    state === "done" && s.tone === "success" && "border-emerald-500 bg-emerald-500 text-white",
                    state === "done" && s.tone === "warn" && "border-orange-500 bg-orange-500 text-white",
                    state === "done" && s.tone === "neutral" && "border-foreground bg-foreground text-background",
                    state === "running" && "border-foreground text-foreground",
                    state === "pending" && "border-border text-muted-foreground/40",
                  )}
                >
                  {state === "running" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : state === "done" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span className="text-xs">{i + 1}</span>
                  )}
                </span>
                <div
                  className={cn(
                    "pt-1 transition-opacity",
                    state === "pending" ? "opacity-50" : "opacity-100",
                  )}
                >
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="font-mono text-xs text-muted-foreground">{s.sub}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
