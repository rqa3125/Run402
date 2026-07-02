"use client";

import * as React from "react";
import { FolderKanban } from "lucide-react";
import { EmptyState } from "@/components/dashboard/empty-state";
import { SearchInput } from "@/components/dashboard/search-input";
import { CreateProjectDialog } from "./create-project-dialog";
import { ProjectsTable } from "./projects-table";
import type { PublicProject } from "@/lib/data/projects";

export function ProjectsBrowser({ projects }: { projects: PublicProject[] }) {
  const [query, setQuery] = React.useState("");

  if (projects.length === 0) {
    return (
      <EmptyState
        icon={FolderKanban}
        title="No projects yet"
        description="Create your first project to generate API keys and start monetizing an endpoint."
        action={<CreateProjectDialog />}
      />
    );
  }

  const filtered = projects.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return `${p.name} ${p.description ?? ""}`.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <SearchInput
          value={query}
          onChange={setQuery}
          placeholder="Search projects…"
          className="max-w-sm"
        />
        <CreateProjectDialog />
      </div>
      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No projects match “{query}”.
        </p>
      ) : (
        <ProjectsTable projects={filtered} />
      )}
    </div>
  );
}
