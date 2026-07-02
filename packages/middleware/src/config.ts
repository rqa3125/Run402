import { errors } from "./errors";

export type Run402Mode = "payment" | "subscription";
export type Run402Environment = "sandbox" | "live";
export type Run402Framework = "express" | "next" | "fastify";

/**
 * Options for {@link protect}.
 *
 * @example
 * ```ts
 * app.use("/premium", protect({
 *   projectKey: process.env.RUN402_SECRET_KEY,
 *   endpoint: "/premium",
 *   price: "$0.50",
 * }))
 * ```
 */
export interface ProtectOptions {
  /**
   * Project key. Use your **secret key** (`sk_…`) — it runs server-side.
   * Falls back to `process.env.RUN402_SECRET_KEY` when omitted.
   */
  projectKey?: string;
  /** The registered endpoint route this middleware guards, e.g. `"/premium"`. */
  endpoint: string;
  /**
   * Optional price hint, e.g. `"$0.50"` or `0.5`. The registered endpoint's
   * price in the dashboard is authoritative; this is used for local display.
   */
  price?: string | number;
  /** `"payment"` (default) charges per request. `"subscription"` is Sprint 6. */
  mode?: Run402Mode;
  /** Where the checkout redirects on success. */
  successUrl?: string;
  /** Where the checkout redirects on cancel. */
  cancelUrl?: string;
  /** Run402 control-plane origin. Defaults to `RUN402_BASE_URL` or localhost:3001. */
  baseUrl?: string;
  /** Header the client presents its payment token in. Default: `x-run402-token`. */
  tokenHeader?: string;
}

export interface ProtectConfig {
  projectKey: string;
  endpoint: string;
  priceCents?: number;
  mode: Run402Mode;
  successUrl?: string;
  cancelUrl?: string;
  baseUrl: string;
  tokenHeader: string;
}

/** Parse `"$0.50"` / `0.5` → integer cents. Returns undefined when absent. */
export function parsePrice(value: string | number | undefined): number | undefined {
  if (value === undefined) return undefined;
  const dollars =
    typeof value === "number" ? value : parseFloat(value.replace(/[^0-9.]/g, ""));
  if (!Number.isFinite(dollars) || dollars < 0) throw errors.invalidPrice(value);
  return Math.round(dollars * 100);
}

/** Validate + normalize options. Throws a {@link Run402Error} on bad config. */
export function resolveConfig(options: ProtectOptions): ProtectConfig {
  const projectKey = options?.projectKey ?? process.env.RUN402_SECRET_KEY;
  if (!projectKey) throw errors.missingProjectKey();
  if (!options?.endpoint) throw errors.missingEndpoint();

  const mode = options.mode ?? "payment";
  if (mode === "subscription") throw errors.subscriptionsUnavailable();

  const baseUrl =
    options.baseUrl ?? process.env.RUN402_BASE_URL ?? "http://localhost:3001";

  return {
    projectKey,
    endpoint: options.endpoint,
    priceCents: parsePrice(options.price),
    mode,
    successUrl: options.successUrl,
    cancelUrl: options.cancelUrl,
    baseUrl: baseUrl.replace(/\/$/, ""),
    tokenHeader: (options.tokenHeader ?? "x-run402-token").toLowerCase(),
  };
}

/**
 * Project configuration used by the CLI (`run402.config.ts`) and tooling.
 * `defineConfig` is an identity helper that gives you full autocomplete.
 *
 * @example
 * ```ts
 * import { defineConfig } from "run402"
 *
 * export default defineConfig({
 *   projectKey: process.env.RUN402_SECRET_KEY!,
 *   environment: "sandbox",
 *   framework: "express",
 *   port: 4000,
 * })
 * ```
 */
export interface Run402Config {
  /** Project secret key (`sk_…`). Prefer an env var over hardcoding. */
  projectKey: string;
  /** `"sandbox"` (default) or `"live"` (Sprint 6). */
  environment?: Run402Environment;
  /** Your app framework. */
  framework?: Run402Framework;
  /** Local dev port your app listens on. */
  port?: number;
  /** Run402 control-plane origin. Default: http://localhost:3001. */
  baseUrl?: string;
}

export function defineConfig(config: Run402Config): Run402Config {
  return config;
}
