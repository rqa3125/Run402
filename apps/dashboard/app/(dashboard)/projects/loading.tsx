import { Skeleton } from "@run402/ui";

export default function ProjectsLoading() {
  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  );
}
