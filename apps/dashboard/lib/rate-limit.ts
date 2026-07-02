import { RateLimitError } from "@run402/utils/errors";

/**
 * Minimal in-memory sliding-window rate limiter for the public control-plane
 * routes. Cached on globalThis to survive HMR. Good enough for a single-node
 * dev/self-host setup; swap for Redis/Upstash when running multi-instance.
 */
interface Bucket {
  hits: number[];
}

const globalForLimit = globalThis as unknown as {
  __run402_rate?: Map<string, Bucket>;
};

const store = globalForLimit.__run402_rate ?? new Map<string, Bucket>();
globalForLimit.__run402_rate = store;

export interface RateLimitOptions {
  /** Bucket key (e.g. project key or IP). */
  key: string;
  /** Max requests allowed within the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

/** Throws `RateLimitError` (429) when the caller exceeds the window budget. */
export function enforceRateLimit(opts: RateLimitOptions): void {
  const now = Date.now();
  const from = now - opts.windowMs;
  const bucket = store.get(opts.key) ?? { hits: [] };

  bucket.hits = bucket.hits.filter((t) => t > from);
  if (bucket.hits.length >= opts.limit) {
    store.set(opts.key, bucket);
    throw new RateLimitError("Rate limit exceeded. Slow down and retry shortly.");
  }

  bucket.hits.push(now);
  store.set(opts.key, bucket);
}

/** Best-effort client IP from standard proxy headers. */
export function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  );
}
