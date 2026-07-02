import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@run402/ui";

export interface StatCardProps {
  label: string;
  value?: string | number;
  icon: LucideIcon;
  comingSoon?: boolean;
}

export function StatCard({ label, value, icon: Icon, comingSoon }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {comingSoon ? (
          <div className="text-sm font-medium text-muted-foreground/60">
            Coming soon
          </div>
        ) : (
          <div className="text-3xl font-semibold tracking-tight tabular-nums">
            {value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
