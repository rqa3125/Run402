import { apiHandler } from "@/lib/api/handler";
import { noContent, ok } from "@/lib/api/response";
import { requireUserId } from "@/lib/auth";
import { deleteProject, updateProject } from "@/lib/data/projects";
import { updateProjectSchema } from "@/lib/validations/project";

type Ctx = { params: Promise<{ id: string }> };

/** PATCH /api/v1/projects/:id — update project settings. */
export const PATCH = apiHandler<Ctx>(async (req, _api, ctx) => {
  const userId = await requireUserId();
  const { id } = await ctx.params;
  const input = updateProjectSchema.parse(await req.json());
  const project = await updateProject(userId, id, input);
  return ok({ project });
});

/** DELETE /api/v1/projects/:id — delete a project and all its data. */
export const DELETE = apiHandler<Ctx>(async (_req, api, ctx) => {
  const userId = await requireUserId();
  const { id } = await ctx.params;
  await deleteProject(userId, id);
  api.log.info({ projectId: id }, "project deleted");
  return noContent();
});
