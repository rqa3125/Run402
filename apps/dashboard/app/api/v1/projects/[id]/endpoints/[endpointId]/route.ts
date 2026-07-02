import { apiHandler } from "@/lib/api/handler";
import { noContent, ok } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth";
import { deleteEndpoint, updateEndpoint } from "@/lib/data/endpoints";
import { updateEndpointSchema } from "@/lib/validations/endpoint";

type Ctx = { params: Promise<{ id: string; endpointId: string }> };

/** PATCH /api/v1/projects/:id/endpoints/:endpointId — edit an endpoint. */
export const PATCH = apiHandler<Ctx>(async (req, _api, ctx) => {
  const userId = await requireUserId();
  const { id, endpointId } = await ctx.params;
  const input = updateEndpointSchema.parse(await req.json());
  const endpoint = await updateEndpoint(userId, id, endpointId, input);
  return ok({ endpoint });
});

/** DELETE /api/v1/projects/:id/endpoints/:endpointId — delete an endpoint. */
export const DELETE = apiHandler<Ctx>(async (_req, _api, ctx) => {
  const userId = await requireUserId();
  const { id, endpointId } = await ctx.params;
  await deleteEndpoint(userId, id, endpointId);
  return noContent();
});
