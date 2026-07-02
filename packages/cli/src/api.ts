import type { CliContext } from "./config";

export interface CliSummary {
  project: {
    id: string;
    name: string;
    environment: string;
    currency: string;
    status: string;
  };
  endpoints: {
    id: string;
    method: string;
    path: string;
    price: number;
    status: string;
    environment: string;
  }[];
  logs: {
    id: string;
    method: string;
    path: string;
    statusCode: number;
    paymentStatus: string;
    durationMs: number;
    createdAt: string;
  }[];
}

export class CliApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "CliApiError";
  }
}

interface HttpResult {
  status: number;
  body: Record<string, unknown>;
}

async function post(
  baseUrl: string,
  path: string,
  body: unknown,
): Promise<HttpResult> {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status, body: json };
}

function messageOf(body: Record<string, unknown>): string {
  const err = body.error;
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Request failed";
}

export async function fetchSummary(
  ctx: CliContext,
  logLimit = 20,
): Promise<CliSummary> {
  const { status, body } = await post(ctx.baseUrl, "/api/run402/cli/summary", {
    projectKey: ctx.projectKey,
    logLimit,
  });
  if (status !== 200) throw new CliApiError(status, messageOf(body));
  return body as unknown as CliSummary;
}

export async function verifyRequest(
  ctx: CliContext,
  args: { method: string; path: string; token?: string },
): Promise<HttpResult> {
  return post(ctx.baseUrl, "/api/run402/verify", {
    projectKey: ctx.projectKey,
    method: args.method,
    path: args.path,
    token: args.token ?? null,
  });
}

export async function payPayment(
  ctx: CliContext,
  paymentId: string,
): Promise<HttpResult> {
  return post(ctx.baseUrl, "/api/run402/checkout/pay", { paymentId });
}

export async function checkHealth(baseUrl: string): Promise<boolean> {
  try {
    const res = await fetch(`${baseUrl}/api/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
