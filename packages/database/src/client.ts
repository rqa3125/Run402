import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { serverEnv } from "@run402/env/server";
import * as schema from "./schema";

/**
 * A single pooled Postgres client per process. `postgres` connects lazily on
 * the first query, so importing this module is cheap and side-effect free
 * beyond client construction. In dev we cache on `globalThis` to survive
 * Next.js HMR and avoid exhausting connections.
 */
const globalForDb = globalThis as unknown as {
  __run402_pg?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__run402_pg ??
  postgres(serverEnv.DATABASE_URL, {
    max: serverEnv.NODE_ENV === "production" ? 10 : 1,
    prepare: false, // Supabase transaction pooler compatibility
  });

if (serverEnv.NODE_ENV !== "production") {
  globalForDb.__run402_pg = client;
}

export const db = drizzle(client, { schema, casing: "snake_case" });

export type Database = typeof db;
export { client as pgClient };
