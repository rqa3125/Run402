import { resolveConfig, type ProtectOptions } from "./config";
import { verify } from "./client";

/**
 * Minimal structural Express types — avoids a hard dependency on `express`.
 * Real Express req/res satisfy these shapes.
 */
interface Req {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}
interface Res {
  status(code: number): Res;
  json(body: unknown): void;
}
type Next = (err?: unknown) => void;

/**
 * Express middleware that gates a route behind a Run402 payment.
 *
 * Flow: read the payment token header → ask the control plane to verify →
 * if paid, `next()`; otherwise relay the control plane's response (a 402 with
 * `{ error, payment_url }`, or a typed error like invalid_key / unknown_endpoint).
 */
export function protect(options: ProtectOptions) {
  const config = resolveConfig(options);

  return async function run402Middleware(
    req: Req,
    res: Res,
    next: Next,
  ): Promise<void> {
    const header = req.headers[config.tokenHeader];
    const token = Array.isArray(header) ? header[0] : header;
    const method = (req.method ?? "GET").toUpperCase();

    try {
      const result = await verify(config, {
        method,
        path: config.endpoint,
        token,
      });

      if (result.status === 200) {
        next();
        return;
      }
      res.status(result.status).json(result.body);
    } catch (error) {
      // The control plane is unreachable — fail closed with a clear error.
      res.status(502).json({
        error: "run402_unavailable",
        message: "Could not reach the Run402 control plane.",
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  };
}
