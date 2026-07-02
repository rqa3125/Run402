import { apiHandler } from "@/lib/api/handler";
import { created } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth";
import { duplicateEndpoint } from "@/lib/data/endpoints";

type Ctx = { params: Promise<{ id: string; endpointId: string }> };

/** POST /api/v1/projects/:id/endpoints/:endpointId/duplicate — clone it. */
export const POST = apiHandler<Ctx>(async (_req, _api, ctx) => {
  const userId = await requireUserId();
  const { id, endpointId } = await ctx.params;
  const endpoint = await duplicateEndpoint(userId, id, endpointId);
  return created({ endpoint });
});
