import { pgEnum } from "drizzle-orm/pg-core";

/** Shared enums used across domain tables. */

export const environment = pgEnum("environment", ["sandbox", "live"]);

export const httpMethod = pgEnum("http_method", [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);
