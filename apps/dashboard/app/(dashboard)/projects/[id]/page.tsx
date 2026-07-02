import type { Metadata } from "next";
import { Activity, DollarSign, Webhook, Zap } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@run402/ui";
import { StatCard } from "@/components/dashboard/stat-card";
import { OnboardingChecklist } from "@/components/projects/onboarding-checklist";
import { TestIntegration } from "@/components/projects/test-integration";
import { requireUser } from "@/lib/auth";
import { getProject } from "@/lib/data/projects";
import { listEndpoints } from "@/lib/data/endpoints";
import { formatDate, formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Project overview" };

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  const [project, endpoints] = await Promise.all([
    getProject(user.id, id),
    listEndpoints(user.id, id),
  ]);
  const firstPath = endpoints[0]?.path ?? "/api/premium";

  const details: { label: string; value: string; mono?: boolean }[] = [
    { label: "Project ID", value: project.id, mono: true },
    { label: "Environment", value: "Sandbox" },
    { label: "Status", value: project.status },
    { label: "Default currency", value: project.currency.toUpperCase() },
    {
      label: "Price per request",
      value: formatPrice(project.pricePerRequest, project.currency),
    },
    { label: "Created", value: formatDate(project.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total endpoints" value={endpoints.length} icon={Webhook} />
        <StatCard label="Sandbox requests" value={0} icon={Zap} />
        <StatCard label="Live requests" value={0} icon={Activity} />
        <StatCard label="Revenue" icon={DollarSign} comingSoon />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {details.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between gap-4 py-2.5 text-sm"
              >
                <span className="text-muted-foreground">{d.label}</span>
                <span
                  className={
                    d.mono
                      ? "truncate font-mono text-xs"
                      : "font-medium capitalize"
                  }
                >
                  {d.value}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <OnboardingChecklist projectId={project.id} hasEndpoints={endpoints.length > 0} />
      </div>

      <TestIntegration projectId={project.id} defaultPath={firstPath} />
    </div>
  );
}
