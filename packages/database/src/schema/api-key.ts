import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { project } from "./project";
import { environment } from "./enums";

export const apiKeyType = pgEnum("api_key_type", ["publishable", "secret"]);

/**
 * Structured per-key records powering the API Keys UI.
 *
 * `key` holds the DISPLAYABLE value: the full plaintext for publishable keys
 * (which are public), or a masked preview for secret keys. For secrets we also
 * store `keyHash` (SHA-256) — the plaintext secret is shown once at generation
 * and never persisted. (Deviation from the literal spec column list, kept for
 * the same security reason as the project's secret handling in Sprint 2.)
 */
export const apiKey = pgTable(
  "api_key",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    type: apiKeyType("type").notNull(),
    key: text("key").notNull(),
    keyHash: text("key_hash"),
    environment: environment("environment").notNull().default("sandbox"),
    lastUsed: timestamp("last_used"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    projectIdx: index("api_key_project_idx").on(t.projectId),
  }),
);
