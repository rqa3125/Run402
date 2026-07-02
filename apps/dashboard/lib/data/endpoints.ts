import { and, db, desc, eq, schema, type Endpoint } from "@run402/database";
import { newId, rawId } from "@run402/utils";
import { ConflictError, NotFoundError } from "@run402/utils/errors";
import { assertProjectOwnership } from "./projects";
import { dollarsToMicros } from "@/lib/format";
import type {
  CreateEndpointInput,
  UpdateEndpointInput,
} from "@/lib/validations/endpoint";

/** Endpoints data-access layer. All operations verify project ownership. */

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "23505"
  );
}

const DUPLICATE_MESSAGE =
  "An endpoint with this method and route already exists in this environment";

export async function listEndpoints(
  userId: string,
  projectId: string,
): Promise<Endpoint[]> {
  await assertProjectOwnership(userId, projectId);
  return db
    .select()
    .from(schema.endpoint)
    .where(eq(schema.endpoint.projectId, projectId))
    .orderBy(desc(schema.endpoint.createdAt));
}

export async function createEndpoint(
  userId: string,
  projectId: string,
  input: CreateEndpointInput,
): Promise<Endpoint> {
  await assertProjectOwnership(userId, projectId);
  try {
    const rows = await db
      .insert(schema.endpoint)
      .values({
        id: newId("endpoint"),
        projectId,
        name: input.name,
        description: input.description ?? null,
        method: input.method,
        path: input.path,
        price: dollarsToMicros(input.price),
        environment: input.environment,
        status: "active",
      })
      .returning();
    const endpoint = rows[0];
    if (!endpoint) throw new Error("Insert returned no rows");
    return endpoint;
  } catch (error) {
    if (isUniqueViolation(error)) throw new ConflictError(DUPLICATE_MESSAGE);
    throw error;
  }
}

export async function updateEndpoint(
  userId: string,
  projectId: string,
  endpointId: string,
  input: UpdateEndpointInput,
): Promise<Endpoint> {
  await assertProjectOwnership(userId, projectId);
  try {
    const rows = await db
      .update(schema.endpoint)
      .set({
        name: input.name,
        description: input.description ?? null,
        method: input.method,
        path: input.path,
        price: dollarsToMicros(input.price),
        environment: input.environment,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(schema.endpoint.id, endpointId),
          eq(schema.endpoint.projectId, projectId),
        ),
      )
      .returning();
    const endpoint = rows[0];
    if (!endpoint) throw new NotFoundError("Endpoint not found");
    return endpoint;
  } catch (error) {
    if (isUniqueViolation(error)) throw new ConflictError(DUPLICATE_MESSAGE);
    throw error;
  }
}

export async function deleteEndpoint(
  userId: string,
  projectId: string,
  endpointId: string,
): Promise<void> {
  await assertProjectOwnership(userId, projectId);
  const rows = await db
    .delete(schema.endpoint)
    .where(
      and(
        eq(schema.endpoint.id, endpointId),
        eq(schema.endpoint.projectId, projectId),
      ),
    )
    .returning({ id: schema.endpoint.id });
  if (!rows[0]) throw new NotFoundError("Endpoint not found");
}

/** Clone an endpoint; the route is suffixed to satisfy the unique constraint. */
export async function duplicateEndpoint(
  userId: string,
  projectId: string,
  endpointId: string,
): Promise<Endpoint> {
  await assertProjectOwnership(userId, projectId);
  const source = (
    await db
      .select()
      .from(schema.endpoint)
      .where(
        and(
          eq(schema.endpoint.id, endpointId),
          eq(schema.endpoint.projectId, projectId),
        ),
      )
      .limit(1)
  )[0];
  if (!source) throw new NotFoundError("Endpoint not found");

  const rows = await db
    .insert(schema.endpoint)
    .values({
      id: newId("endpoint"),
      projectId,
      name: `${source.name} (copy)`,
      description: source.description,
      method: source.method,
      path: `${source.path}-copy-${rawId().slice(0, 4)}`,
      price: source.price,
      environment: source.environment,
      status: source.status,
    })
    .returning();
  const endpoint = rows[0];
  if (!endpoint) throw new Error("Insert returned no rows");
  return endpoint;
}
