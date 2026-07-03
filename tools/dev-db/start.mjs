import EmbeddedPostgres from "embedded-postgres";

/**
 * Boots a real local Postgres on :5432 with data under tools/dev-db/data.
 * No Homebrew or Docker required — binaries ship via npm.
 *
 *   cd tools/dev-db && npm install && npm start
 *   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/run402
 */
const pg = new EmbeddedPostgres({
  databaseDir: new URL("./data", import.meta.url).pathname,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
});

const shutdown = async () => {
  console.log("\n[dev-db] stopping postgres…");
  await pg.stop().catch(() => {});
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

try {
  await pg.initialise();
} catch {
  /* already initialised — fine */
}
await pg.start();
try {
  await pg.createDatabase("run402");
  console.log("[dev-db] created database run402");
} catch {
  console.log("[dev-db] database run402 already exists");
}
console.log(
  "[dev-db] postgres ready → postgresql://postgres:postgres@localhost:5432/run402",
);
