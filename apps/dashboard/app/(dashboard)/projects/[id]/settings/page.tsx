import type { Metadata } from "next";
import { ProjectSettings } from "@/components/projects/project-settings";
import { requireUser } from "@/lib/auth";
import { getProject } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Project settings" };

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const project = await getProject(user.id, id);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage this project.</p>
      </div>
      <ProjectSettings project={project} />
    </div>
  );
}
