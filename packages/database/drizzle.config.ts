import { defineConfig } from "drizzle-kit";

/**
 * Drizzle Kit config for schema diffing, migration generation and Studio.
 * Reads DATABASE_URL directly (dotenv is loaded by the calling script).
 */
export default defineConfig({
  schema: "./src/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});
