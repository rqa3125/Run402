import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@run402/ui";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Icon className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {action ? <div className="mt-2">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
