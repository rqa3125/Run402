import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { cn } from "@run402/ui";

const styles = {
  info: { icon: Info, cls: "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300" },
  warning: {
    icon: AlertTriangle,
    cls: "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300",
  },
  tip: {
    icon: Lightbulb,
    cls: "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300",
  },
} as const;

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof styles;
  title?: string;
  children: React.ReactNode;
}) {
  const { icon: Icon, cls } = styles[type];
  return (
    <div className={cn("my-4 flex gap-3 rounded-lg border p-4 text-sm", cls)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1">
        {title && <p className="font-medium">{title}</p>}
        <div className="text-foreground/80">{children}</div>
      </div>
    </div>
  );
}
