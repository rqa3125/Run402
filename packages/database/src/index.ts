export { db, pgClient, type Database } from "./client";
export * as schema from "./schema";

// Re-export the query builder helpers most consumers need.
export {
  eq,
  and,
  or,
  desc,
  asc,
  gt,
  gte,
  lt,
  lte,
  sql,
  count,
  inArray,
  isNull,
  isNotNull,
} from "drizzle-orm";

// Inferred row types for the domain tables.
import type { project } from "./schema/project";
import type { endpoint } from "./schema/endpoint";
import type { apiKey } from "./schema/api-key";
import type { payment } from "./schema/payment";
import type { paymentToken } from "./schema/payment-token";
import type { requestLog } from "./schema/request-log";

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;
export type Endpoint = typeof endpoint.$inferSelect;
export type NewEndpoint = typeof endpoint.$inferInsert;
export type ApiKey = typeof apiKey.$inferSelect;
export type NewApiKey = typeof apiKey.$inferInsert;
export type Payment = typeof payment.$inferSelect;
export type NewPayment = typeof payment.$inferInsert;
export type PaymentToken = typeof paymentToken.$inferSelect;
export type NewPaymentToken = typeof paymentToken.$inferInsert;
export type RequestLog = typeof requestLog.$inferSelect;
export type NewRequestLog = typeof requestLog.$inferInsert;
