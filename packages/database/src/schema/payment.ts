import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { project } from "./project";
import { endpoint } from "./endpoint";
import { environment } from "./enums";

export const paymentStatus = pgEnum("payment_status", [
  "pending",
  "paid",
  "refunded",
  "expired",
]);

/**
 * Run402's durable ledger of payments. The `id` mirrors the payment provider's
 * id (mock today, Stripe later). `amount` is micro-dollars.
 */
export const payment = pgTable(
  "payment",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    endpointId: text("endpoint_id")
      .notNull()
      .references(() => endpoint.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull().default("usd"),
    status: paymentStatus("status").notNull().default("pending"),
    provider: text("provider").notNull().default("mock"),
    environment: environment("environment").notNull().default("sandbox"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => ({
    projectIdx: index("payment_project_idx").on(t.projectId),
  }),
);
