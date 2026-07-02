import { db, desc, eq, schema } from "@run402/database";
import { UnauthorizedError } from "@run402/utils/errors";
import { getProjectByKey } from "./projects";

/** Compact project summary for the CLI (`run402 dev / status / logs`). */
export interface CliSummary {
  project: {
    id: string;
    name: string;
    environment: "sandbox";
    currency: string;
    status: string;
  };
  endpoints: {
    id: string;
    method: string;
    path: string;
    price: number;
    status: string;
    environment: string;
  }[];
  logs: {
    id: string;
    method: string;
    path: string;
    statusCode: number;
    paymentStatus: string;
    durationMs: number;
    createdAt: string;
  }[];
}

export async function getCliSummary(
  key: string,
  logLimit = 20,
): Promise<CliSummary> {
  const project = await getProjectByKey(key);
  if (!project) throw new UnauthorizedError("Invalid project key");

  const endpoints = await db
    .select({
      id: schema.endpoint.id,
      method: schema.endpoint.method,
      path: schema.endpoint.path,
      price: schema.endpoint.price,
      status: schema.endpoint.status,
      environment: schema.endpoint.environment,
    })
    .from(schema.endpoint)
    .where(eq(schema.endpoint.projectId, project.id))
    .orderBy(schema.endpoint.path);

  const logs = await db
    .select({
      id: schema.requestLog.id,
      method: schema.requestLog.method,
      path: schema.requestLog.path,
      statusCode: schema.requestLog.statusCode,
      paymentStatus: schema.requestLog.paymentStatus,
      durationMs: schema.requestLog.durationMs,
      createdAt: schema.requestLog.createdAt,
    })
    .from(schema.requestLog)
    .where(eq(schema.requestLog.projectId, project.id))
    .orderBy(desc(schema.requestLog.createdAt))
    .limit(logLimit);

  return {
    project: {
      id: project.id,
      name: project.name,
      environment: "sandbox",
      currency: project.currency,
      status: project.status,
    },
    endpoints,
    logs: logs.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() })),
  };
}
