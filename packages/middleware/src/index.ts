/**
 * `run402` — API monetization middleware & SDK.
 *
 * @example Protect an Express route
 * ```ts
 * import { protect } from "run402"
 *
 * app.use("/premium", protect({
 *   projectKey: process.env.RUN402_SECRET_KEY,
 *   endpoint: "/premium",
 *   price: "$0.50",
 * }))
 * ```
 *
 * Express is the only supported framework in this release.
 */
export { protect } from "./express";
export {
  resolveConfig,
  parsePrice,
  defineConfig,
  type ProtectOptions,
  type ProtectConfig,
  type Run402Config,
  type Run402Mode,
  type Run402Environment,
  type Run402Framework,
} from "./config";
export { verify, type VerifyResponse, type VerifyArgs } from "./client";
export { Run402Error, errors, type Run402ErrorOptions } from "./errors";
