import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const projectStatus = pgEnum("project_status", [
  "active",
  "paused",
  "archived",
]);

/**
 * A project is a monetizable API surface owned directly by a user.
 * `userId` stores the external auth provider's user id (Clerk `user_…`); auth
 * lives entirely in Clerk, so there is no local user table to foreign-key to.
 *
 * Key handling (Stripe/Clerk model):
 *  - `publishableKey` (pk_live_…) is public and stored/displayed in plaintext.
 *  - The secret key (sk_live_…) is shown to the user exactly once at creation.
 *    We persist only `secretKeyHash` (SHA-256) + `secretKeyPreview` (masked).
 *    The plaintext secret is NEVER stored or returned again.
 *
 * `pricePerRequest` is an integer in micro-dollars (1 USD = 1_000_000) to keep
 * money as exact integers and support sub-cent per-request pricing.
 */
export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    description: text("description"),
    publishableKey: text("publishable_key").notNull().unique(),
    secretKeyHash: text("secret_key_hash").notNull(),
    secretKeyPreview: text("secret_key_preview").notNull(),
    currency: text("currency").notNull().default("usd"),
    pricePerRequest: integer("price_per_request").notNull().default(0),
    status: projectStatus("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("project_user_idx").on(t.userId),
  }),
);
