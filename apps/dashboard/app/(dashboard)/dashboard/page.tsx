import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  DollarSign,
  FolderKanban,
  Plug,
  Rocket,
} from "lucide-react";
import { Button } from "@run402/ui";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/dashboard/empty-state";
import { requireUser } from "@/lib/auth";
import { listProjects } from "@/lib/data/projects";

export const metadata: Metadata = { title: "Overview" };

export default async function OverviewPage() {
  const user = await requireUser();
  const projects = await listProjects(user.id);
  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <>
      <PageHeader
        title={`Welcome back, ${firstName}`}
        description="Here's what's happening across your APIs."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Projects" value={projects.length} icon={FolderKanban} />
        <StatCard label="Revenue" icon={DollarSign} comingSoon />
        <StatCard label="Requests" icon={Activity} comingSoon />
        <StatCard label="Active APIs" icon={Plug} comingSoon />
      </div>

      <div className="mt-6">
        {projects.length === 0 ? (
          <EmptyState
            icon={Rocket}
            title="Create your first project"
            description="A project generates the keys you'll use to monetize an API. It only takes a minute."
            action={
              <Button asChild>
                <Link href="/projects">
                  Go to Projects <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            }
          />
        ) : (
          <div className="rounded-xl border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-medium">Your projects</h2>
                <p className="text-sm text-muted-foreground">
                  You have {projects.length} project{projects.length === 1 ? "" : "s"}.
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/projects">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
