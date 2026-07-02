"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CreditCard,
  ExternalLink,
  Loader2,
  Play,
  RotateCcw,
  Send,
} from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@run402/ui";

export interface PlaygroundEndpoint {
  id: string;
  method: string;
  path: string;
  name: string;
}
export interface PlaygroundProject {
  id: string;
  name: string;
  publishableKey: string;
  endpoints: PlaygroundEndpoint[];
}

interface ExchangeResult {
  status: number;
  durationMs: number;
  body: unknown;
  requestHeaders: Record<string, string>;
  responseHeaders: Record<string, string>;
}

type Phase = "idle" | "blocked" | "paid" | "success";

export function Playground({ projects }: { projects: PlaygroundProject[] }) {
  const [projectId, setProjectId] = React.useState(projects[0]?.id ?? "");
  const project = projects.find((p) => p.id === projectId);
  const [endpointId, setEndpointId] = React.useState(
    project?.endpoints[0]?.id ?? "",
  );
  const endpoint = project?.endpoints.find((e) => e.id === endpointId);

  const [phase, setPhase] = React.useState<Phase>("idle");
  const [busy, setBusy] = React.useState<null | "send" | "pay" | "retry">(null);
  const [initial, setInitial] = React.useState<ExchangeResult | null>(null);
  const [retry, setRetry] = React.useState<ExchangeResult | null>(null);
  const [payment, setPayment] = React.useState<{ id: string; url: string } | null>(null);
  const [token, setToken] = React.useState<string | null>(null);

  const reset = () => {
    setPhase("idle");
    setInitial(null);
    setRetry(null);
    setPayment(null);
    setToken(null);
  };

  React.useEffect(() => {
    // Reset when the selection changes.
    setEndpointId(project?.endpoints[0]?.id ?? "");
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const verify = async (withToken?: string): Promise<ExchangeResult> => {
    const requestHeaders: Record<string, string> = {
      "content-type": "application/json",
    };
    if (withToken) requestHeaders["x-run402-token"] = withToken;
    const t0 = performance.now();
    const res = await fetch("/api/run402/verify", {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify({
        projectKey: project!.publishableKey,
        method: endpoint!.method,
        path: endpoint!.path,
        token: withToken ?? null,
      }),
    });
    const durationMs = Math.round(performance.now() - t0);
    const body = await res.json().catch(() => ({}));
    const responseHeaders: Record<string, string> = {};
    ["content-type", "x-request-id"].forEach((h) => {
      const v = res.headers.get(h);
      if (v) responseHeaders[h] = v;
    });
    return { status: res.status, durationMs, body, requestHeaders, responseHeaders };
  };

  const send = async () => {
    if (!project || !endpoint) return;
    setBusy("send");
    reset();
    try {
      const result = await verify();
      setInitial(result);
      const body = result.body as { payment_url?: string; payment_id?: string };
      if (result.status === 402 && body.payment_id) {
        setPayment({ id: body.payment_id, url: body.payment_url ?? "" });
        setPhase("blocked");
      } else {
        setPhase("idle");
      }
    } finally {
      setBusy(null);
    }
  };

  const pay = async () => {
    if (!payment) return;
    setBusy("pay");
    try {
      const res = await fetch("/api/run402/checkout/pay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ paymentId: payment.id }),
      });
      if (!res.ok) {
        toast.error("Payment failed");
        return;
      }
      const data = (await res.json()) as { token: string };
      setToken(data.token);
      setPhase("paid");
    } finally {
      setBusy(null);
    }
  };

  const doRetry = async () => {
    if (!token) return;
    setBusy("retry");
    try {
      const result = await verify(token);
      setRetry(result);
      setPhase("success");
    } finally {
      setBusy(null);
    }
  };

  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-16 text-center">
          <p className="font-medium">No endpoints to test yet</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            Create a project and register an endpoint, then come back to run the
            full 402 → 200 flow here.
          </p>
          <Button asChild className="mt-4">
            <Link href="/projects">Go to Projects</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      {/* config */}
      <Card className="lg:sticky lg:top-24 lg:self-start">
        <CardHeader>
          <CardTitle className="text-base">Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Project">
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Endpoint">
            {project && project.endpoints.length > 0 ? (
              <Select value={endpointId} onValueChange={setEndpointId}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {project.endpoints.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.method} {e.path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-xs text-muted-foreground">
                This project has no endpoints.{" "}
                <Link href={`/projects/${projectId}/endpoints`} className="underline">
                  Create one
                </Link>
                .
              </p>
            )}
          </Field>

          {endpoint && (
            <div className="rounded-md border border-border bg-muted/40 p-3 font-mono text-xs">
              <span className="text-muted-foreground">{endpoint.method}</span>{" "}
              {endpoint.path}
            </div>
          )}

          <Button className="w-full" onClick={send} disabled={!endpoint || busy !== null}>
            {busy === "send" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Send request
          </Button>
          {phase !== "idle" && (
            <Button variant="ghost" className="w-full" onClick={reset}>
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          )}
        </CardContent>
      </Card>

      {/* flow */}
      <div className="space-y-4">
        {!initial && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
              <Play className="h-6 w-6 text-muted-foreground" />
              <p className="font-medium">Run the full flow</p>
              <p className="max-w-sm text-sm text-muted-foreground">
                Send a request to see a real 402, complete a mock payment, then
                retry to get a 200 OK — exactly what the SDK does.
              </p>
            </CardContent>
          </Card>
        )}

        {initial && (
          <ExchangeCard title="1 · Initial request" result={initial} />
        )}

        {phase === "blocked" && payment && (
          <Card>
            <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-500/10 text-orange-500">
                  <CreditCard className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Payment required</p>
                  <p className="text-xs text-muted-foreground">
                    Complete the mock checkout to receive an access token.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={payment.url} target="_blank" rel="noreferrer">
                    Open checkout <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button size="sm" onClick={pay} disabled={busy !== null}>
                  {busy === "pay" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Complete payment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {(phase === "paid" || phase === "success") && (
          <Card>
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">2 · Payment complete</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    token {token?.slice(0, 10)}…
                  </p>
                </div>
              </div>
              {phase === "paid" && (
                <Button size="sm" onClick={doRetry} disabled={busy !== null}>
                  {busy === "retry" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  Retry request
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {retry && <ExchangeCard title="3 · Retry with token" result={retry} />}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function ExchangeCard({ title, result }: { title: string; result: ExchangeResult }) {
  const ok = result.status < 400;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant={ok ? "success" : result.status === 402 ? "warning" : "secondary"}>
            {result.status}
          </Badge>
          <span className="text-xs text-muted-foreground">{result.durationMs} ms</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <HeaderBlock title="Request headers" headers={result.requestHeaders} />
        <HeaderBlock title="Response headers" headers={result.responseHeaders} />
        <div>
          <p className="mb-1 text-xs font-medium text-muted-foreground">Body</p>
          <pre className="overflow-x-auto rounded-md border border-border bg-muted/40 p-3 font-mono text-xs leading-relaxed">
            {JSON.stringify(result.body, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}

function HeaderBlock({ title, headers }: { title: string; headers: Record<string, string> }) {
  const entries = Object.entries(headers);
  if (entries.length === 0) return null;
  return (
    <div>
      <p className="mb-1 text-xs font-medium text-muted-foreground">{title}</p>
      <div className="rounded-md border border-border bg-muted/40 p-3 font-mono text-xs">
        {entries.map(([k, v]) => (
          <div key={k} className="flex gap-2">
            <span className="text-muted-foreground">{k}:</span>
            <span className={cn("truncate", k === "x-run402-token" && "text-emerald-600")}>
              {k === "x-run402-token" ? `${v.slice(0, 12)}…` : v}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
