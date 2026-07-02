import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { project } from "./project";
import { environment, httpMethod } from "./enums";

export const endpointStatus = pgEnum("endpoint_status", ["active", "disabled"]);

/**
 * A protected endpoint belonging to a project. `price` is in micro-dollars
 * (1 USD = 1_000_000), consistent with `project.pricePerRequest`.
 *
 * `name` + `description` back the create/edit form; the table view shows
 * method/path/price/environment/status.
 */
export const endpoint = pgTable(
  "endpoint",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    method: httpMethod("method").notNull().default("GET"),
    path: text("path").notNull(),
    price: integer("price").notNull().default(0),
    environment: environment("environment").notNull().default("sandbox"),
    status: endpointStatus("status").notNull().default("active"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    projectIdx: index("endpoint_project_idx").on(t.projectId),
    routeUnique: unique("endpoint_project_route_unique").on(
      t.projectId,
      t.method,
      t.path,
      t.environment,
    ),
  }),
);
