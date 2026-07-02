import { index, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { project } from "./project";
import { endpoint } from "./endpoint";
import { payment } from "./payment";

export const tokenStatus = pgEnum("token_status", [
  "valid",
  "used",
  "expired",
  "revoked",
]);

/**
 * A payment token proves an endpoint was paid for. Issued after a successful
 * payment, presented by the client on retry via the `x-run402-token` header.
 * The middleware grants access only for a `valid`, unexpired token that matches
 * the requested project + endpoint.
 */
export const paymentToken = pgTable(
  "payment_token",
  {
    token: text("token").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    endpointId: text("endpoint_id")
      .notNull()
      .references(() => endpoint.id, { onDelete: "cascade" }),
    paymentId: text("payment_id")
      .notNull()
      .references(() => payment.id, { onDelete: "cascade" }),
    status: tokenStatus("status").notNull().default("valid"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (t) => ({
    endpointIdx: index("payment_token_endpoint_idx").on(t.endpointId),
  }),
);
