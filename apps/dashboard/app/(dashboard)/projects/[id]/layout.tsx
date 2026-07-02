import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, FlaskConical } from "lucide-react";
import { Badge, CopyButton } from "@run402/ui";
import { ConsoleNav } from "@/components/projects/console-nav";
import { requireUser } from "@/lib/auth";
import { getProject } from "@/lib/data/projects";
import { isAppError } from "@run402/utils/errors";

const statusVariant = {
  active: "success",
  paused: "warning",
  archived: "secondary",
} as const;

/**
 * Project console shell. Guards ownership for every nested route and renders
 * the project header + sub-navigation (Overview / Endpoints / API Keys / …).
 */
export default async function ProjectConsoleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  const project = await getProject(user.id, id).catch((error) => {
    if (isAppError(error) && error.status === 404) notFound();
    throw error;
  });

  return (
    <div>
      <Link
        href="/projects"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Projects
      </Link>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">{project.name}</h1>
          <Badge variant={statusVariant[project.status]}>{project.status}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1.5">
            <FlaskConical className="h-3 w-3" /> Sandbox
          </Badge>
          <span className="flex items-center gap-1 rounded-full border border-border bg-muted/40 py-1 pl-3 pr-1 font-mono text-xs text-muted-foreground">
            {project.id}
            <CopyButton value={project.id} className="h-6 w-6" />
          </span>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-[180px_minmax(0,1fr)]">
        <aside className="md:sticky md:top-24 md:self-start">
          <ConsoleNav projectId={project.id} />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
