import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { project } from "./project";
import { endpoint } from "./endpoint";
import { environment } from "./enums";

/**
 * One row per request that hit the middleware / control-plane verify endpoint.
 * Powers the project Logs view.
 */
export const requestLog = pgTable(
  "request_log",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    endpointId: text("endpoint_id").references(() => endpoint.id, {
      onDelete: "set null",
    }),
    method: text("method").notNull(),
    path: text("path").notNull(),
    statusCode: integer("status_code").notNull(),
    // "paid" | "unpaid" | "expired" — the payment outcome for this request.
    paymentStatus: text("payment_status").notNull(),
    environment: environment("environment").notNull().default("sandbox"),
    durationMs: integer("duration_ms").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    projectIdx: index("request_log_project_idx").on(t.projectId, t.createdAt),
  }),
);
