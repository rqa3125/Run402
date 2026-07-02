import { Skeleton } from "@run402/ui";

export default function OverviewLoading() {
  return (
    <div>
      <div className="mb-8 space-y-2">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
      <Skeleton className="mt-6 h-32 w-full rounded-xl" />
    </div>
  );
}
