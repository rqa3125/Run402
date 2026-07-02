import { createEnv } from "./create-env";
import * as f from "./fields";

/**
 * Shared server environment consumed by backend packages
 * (`@run402/database`, `@run402/logging`).
 *
 * Authentication env (Clerk) is read by `@clerk/nextjs` directly in the app,
 * so it is not validated here.
 */
export const serverEnv = createEnv({
  server: {
    NODE_ENV: f.nodeEnv,
    LOG_LEVEL: f.logLevel,
    DATABASE_URL: f.databaseUrl,
  },
  runtimeEnv: process.env,
});

export type ServerEnv = typeof serverEnv;
