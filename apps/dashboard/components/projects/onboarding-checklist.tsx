"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Check, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, cn } from "@run402/ui";
import {
  readOnboarding,
  subscribeOnboarding,
  type OnboardingFlags,
} from "@/lib/onboarding";

export function OnboardingChecklist({
  projectId,
  hasEndpoints,
}: {
  projectId: string;
  hasEndpoints: boolean;
}) {
  const [flags, setFlags] = React.useState<OnboardingFlags>({
    copiedSecret: false,
    installed: false,
    tested: false,
  });

  React.useEffect(() => {
    setFlags(readOnboarding(projectId));
    return subscribeOnboarding(() => setFlags(readOnboarding(projectId)));
  }, [projectId]);

  const base = `/projects/${projectId}`;
  const steps = [
    { label: "Create project", done: true },
    { label: "Copy secret key", done: flags.copiedSecret, href: `${base}/keys` },
    { label: "Install the SDK", done: flags.installed, href: `${base}/installation` },
    { label: "Protect an endpoint", done: hasEndpoints, href: `${base}/endpoints` },
    { label: "Run a test request", done: flags.tested },
    { label: "Ready for payments", done: false, locked: true },
  ];

  const completed = steps.filter((s) => s.done).length;
  const pct = Math.round((completed / steps.length) * 100);
  const allDone = completed === steps.length - 1; // everything but the locked goal

  if (allDone) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <div className="text-3xl">🎉</div>
          <p className="font-medium">You&apos;re all set</p>
          <p className="max-w-xs text-sm text-muted-foreground">
            Your integration is wired up end-to-end. Live payments arrive with
            the Stripe integration.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Get started</CardTitle>
          <span className="text-xs text-muted-foreground">
            {completed} of {steps.length}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-[width] duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="divide-y divide-border">
        {steps.map((step) => (
          <div key={step.label} className="flex items-center gap-3 py-2.5">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                step.done
                  ? "border-foreground bg-foreground text-background"
                  : step.locked
                    ? "border-border text-muted-foreground/50"
                    : "border-border text-muted-foreground",
              )}
            >
              {step.done ? (
                <Check className="h-3 w-3" />
              ) : step.locked ? (
                <Lock className="h-2.5 w-2.5" />
              ) : null}
            </span>
            <span
              className={cn(
                "flex-1 text-sm",
                step.done && "text-muted-foreground line-through",
                step.locked && "text-muted-foreground/50",
              )}
            >
              {step.label}
            </span>
            {!step.done && step.href && (
              <Link
                href={step.href}
                className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:underline"
              >
                Go <ArrowRight className="h-3 w-3" />
              </Link>
            )}
            {step.locked && (
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/50">
                Sprint 4
              </span>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
