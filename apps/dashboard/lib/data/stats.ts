import { and, count, db, eq, inArray, schema, sql } from "@run402/database";
import { assertProjectOwnership } from "./projects";

export interface ProjectStats {
  totalRequests: number;
  paidRequests: number;
  revenueMicros: number;
}

export async function getProjectStats(
  userId: string,
  projectId: string,
): Promise<ProjectStats> {
  await assertProjectOwnership(userId, projectId);

  const [requests] = await db
    .select({ total: count() })
    .from(schema.requestLog)
    .where(eq(schema.requestLog.projectId, projectId));

  const [revenue] = await db
    .select({
      amount: sql<number>`coalesce(sum(${schema.payment.amount}), 0)`.mapWith(Number),
      paid: count(),
    })
    .from(schema.payment)
    .where(
      and(
        eq(schema.payment.projectId, projectId),
        eq(schema.payment.status, "paid"),
      ),
    );

  return {
    totalRequests: requests?.total ?? 0,
    paidRequests: revenue?.paid ?? 0,
    revenueMicros: revenue?.amount ?? 0,
  };
}

export interface UserStats {
  projects: number;
  totalRequests: number;
  revenueMicros: number;
  activeEndpoints: number;
}

/** Aggregate stats across all of a user's projects (for the main overview). */
export async function getUserStats(userId: string): Promise<UserStats> {
  const projectRows = await db
    .select({ id: schema.project.id })
    .from(schema.project)
    .where(eq(schema.project.userId, userId));
  const ids = projectRows.map((p) => p.id);

  if (ids.length === 0) {
    return { projects: 0, totalRequests: 0, revenueMicros: 0, activeEndpoints: 0 };
  }

  const [requests] = await db
    .select({ total: count() })
    .from(schema.requestLog)
    .where(inArray(schema.requestLog.projectId, ids));

  const [revenue] = await db
    .select({
      amount: sql<number>`coalesce(sum(${schema.payment.amount}), 0)`.mapWith(Number),
    })
    .from(schema.payment)
    .where(
      and(
        inArray(schema.payment.projectId, ids),
        eq(schema.payment.status, "paid"),
      ),
    );

  const [endpoints] = await db
    .select({ total: count() })
    .from(schema.endpoint)
    .where(
      and(
        inArray(schema.endpoint.projectId, ids),
        eq(schema.endpoint.status, "active"),
      ),
    );

  return {
    projects: ids.length,
    totalRequests: requests?.total ?? 0,
    revenueMicros: revenue?.amount ?? 0,
    activeEndpoints: endpoints?.total ?? 0,
  };
}
