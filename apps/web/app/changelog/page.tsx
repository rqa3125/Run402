import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/ui/reveal";
import { changelog } from "@/content/changelog";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Changelog",
  description: "New features, improvements, and fixes shipping in Run402.",
};

const tagStyles: Record<string, string> = {
  New: "bg-emerald-500/10 text-emerald-600",
  Improved: "bg-blue-500/10 text-blue-600",
  Fixed: "bg-orange-500/10 text-orange-600",
};

export default function ChangelogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Changelog"
        title="What’s new in Run402"
        description="Every release, improvement, and fix — shipped continuously."
      />

      <section className="py-20">
        <div className="container-edge max-w-3xl">
          <div className="relative border-l border-border pl-8 sm:pl-10">
            {changelog.map((entry, i) => (
              <Reveal key={entry.version} delay={i * 0.05} className="relative pb-14 last:pb-0">
                <span className="absolute -left-[41px] top-1.5 flex h-3 w-3 items-center justify-center sm:-left-[49px]">
                  <span className="h-3 w-3 rounded-full border-2 border-background bg-foreground" />
                </span>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-medium",
                      tagStyles[entry.tag]
                    )}
                  >
                    {entry.tag}
                  </span>
                  <span className="font-mono text-sm font-medium">
                    v{entry.version}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(entry.date)}
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-semibold tracking-tight">
                  {entry.title}
                </h2>
                <ul className="mt-4 space-y-2">
                  {entry.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-start gap-3 text-[15px] text-muted-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-border" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
