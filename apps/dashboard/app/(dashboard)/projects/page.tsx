import type { Metadata } from "next";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProjectsBrowser } from "@/components/projects/projects-browser";
import { requireUser } from "@/lib/auth";
import { listProjects } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await listProjects(user.id);

  return (
    <>
      <PageHeader
        title="Projects"
        description="APIs you monetize with Run402."
      />
      <ProjectsBrowser projects={projects} />
    </>
  );
}
