"use client";

import * as React from "react";
import { Check, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button, CopyButton, cn, toast } from "@run402/ui";

type Phase = "review" | "paying" | "done";

export interface MockCheckoutProps {
  paymentId: string;
  projectName: string;
  developer: string;
  endpointLabel: string;
  amountLabel: string;
  currency: string;
  status: "pending" | "paid" | "refunded" | "expired";
  /** When embedded (playground), report the token instead of showing it. */
  onPaid?: (token: string) => void;
}

export function MockCheckout(props: MockCheckoutProps) {
  const [phase, setPhase] = React.useState<Phase>("review");
  const [token, setToken] = React.useState<string | null>(null);

  const unavailable =
    props.status === "expired" || props.status === "refunded";

  const pay = async () => {
    setPhase("paying");
    const res = await fetch("/api/run402/checkout/pay", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paymentId: props.paymentId }),
    });
    if (!res.ok) {
      setPhase("review");
      const body = (await res.json().catch(() => null)) as
        | { error?: { message?: string } }
        | null;
      toast.error(body?.error?.message ?? "Payment failed");
      return;
    }
    const data = (await res.json()) as { token: string };
    setToken(data.token);
    if (props.onPaid) props.onPaid(data.token);
    else setPhase("done");
  };

  return (
    <div className="w-full max-w-md">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
        {/* header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              {props.projectName[0]?.toUpperCase() ?? "R"}
            </span>
            <span className="font-semibold tracking-tight">{props.projectName}</span>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600">
            Test mode
          </span>
        </div>

        {phase === "done" ? (
          <div className="space-y-4 p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Payment complete</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Retry your request with this header to get a 200 OK.
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3 text-left">
              <code className="flex-1 truncate font-mono text-xs">
                x-run402-token: {token}
              </code>
              <CopyButton value={token ?? ""} />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                if (window.opener) window.close();
                else window.history.back();
              }}
            >
              Done
            </Button>
          </div>
        ) : (
          <>
            {/* summary */}
            <div className="space-y-4 p-6">
              <div>
                <p className="text-sm text-muted-foreground">Pay {props.projectName}</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">
                  {props.amountLabel}
                </p>
              </div>

              <dl className="space-y-2 rounded-lg border border-border bg-muted/30 p-4 text-sm">
                <Row label="Endpoint">
                  <span className="font-mono text-xs">{props.endpointLabel}</span>
                </Row>
                <Row label="Currency">{props.currency.toUpperCase()}</Row>
                <Row label="Developer">{props.developer}</Row>
                <div className="my-1 h-px bg-border" />
                <Row label="Total" strong>
                  {props.amountLabel}
                </Row>
              </dl>

              {unavailable ? (
                <div className="rounded-md border border-border bg-muted/40 p-3 text-center text-sm text-muted-foreground">
                  This payment is {props.status} and can no longer be completed.
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    className="h-11 w-full"
                    onClick={pay}
                    disabled={phase === "paying"}
                  >
                    {phase === "paying" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                    Pay {props.amountLabel}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full"
                    onClick={() => {
                      if (window.opener) window.close();
                      else window.history.back();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex items-center justify-center gap-1.5 border-t border-border px-6 py-3 text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secured by Run402 · Mock payment
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  strong,
}: {
  label: string;
  children: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("truncate", strong && "font-semibold text-foreground")}>
        {children}
      </dd>
    </div>
  );
}
