import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { serverEnv } from "@run402/env/server";

/**
 * Applies pending migrations. Run via `pnpm --filter @run402/database db:migrate`.
 * Uses a dedicated single-connection client that is closed on completion.
 */
async function main() {
  const sql = postgres(serverEnv.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);
  // eslint-disable-next-line no-console
  console.log("[db] running migrations…");
  await migrate(db, { migrationsFolder: "./drizzle" });
  // eslint-disable-next-line no-console
  console.log("[db] migrations complete");
  await sql.end();
}

main().catch((error) => {
  console.error("[db] migration failed", error);
  process.exit(1);
});
