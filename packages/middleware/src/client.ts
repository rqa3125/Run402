import type { ProtectConfig } from "./config";

export interface VerifyResponse {
  status: number;
  body: Record<string, unknown>;
}

export interface VerifyArgs {
  method: string;
  path: string;
  token?: string;
}

/**
 * Calls the Run402 control-plane verify endpoint and returns its decision.
 * The control plane owns all policy; the middleware only relays the result.
 */
export async function verify(
  config: ProtectConfig,
  args: VerifyArgs,
): Promise<VerifyResponse> {
  const res = await fetch(`${config.baseUrl}/api/run402/verify`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      projectKey: config.projectKey,
      method: args.method,
      path: args.path,
      token: args.token ?? null,
      // Forwarded hints (currently informational; used for checkout redirects).
      mode: config.mode,
      successUrl: config.successUrl,
      cancelUrl: config.cancelUrl,
    }),
  });

  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  return { status: res.status, body };
}
