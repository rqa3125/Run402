import { db, desc, eq, schema, type RequestLog } from "@run402/database";
import { newId } from "@run402/utils";
import { assertProjectOwnership } from "./projects";

export interface RequestLogEntry {
  projectId: string;
  endpointId: string | null;
  method: string;
  path: string;
  statusCode: number;
  paymentStatus: string;
  durationMs: number;
}

/** Append a request log row. Best-effort — never throws into the request path. */
export async function writeRequestLog(entry: RequestLogEntry): Promise<void> {
  try {
    await db.insert(schema.requestLog).values({
      id: newId("requestLog"),
      projectId: entry.projectId,
      endpointId: entry.endpointId,
      method: entry.method,
      path: entry.path,
      statusCode: entry.statusCode,
      paymentStatus: entry.paymentStatus,
      environment: "sandbox",
      durationMs: entry.durationMs,
    });
  } catch {
    /* logging must not break the verify path */
  }
}

/** List recent request logs for a project (ownership-checked). */
export async function listRequestLogs(
  userId: string,
  projectId: string,
  limit = 100,
): Promise<RequestLog[]> {
  await assertProjectOwnership(userId, projectId);
  return db
    .select()
    .from(schema.requestLog)
    .where(eq(schema.requestLog.projectId, projectId))
    .orderBy(desc(schema.requestLog.createdAt))
    .limit(limit);
}
