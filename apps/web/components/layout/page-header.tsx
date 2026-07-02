import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/ui/reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <header className="relative overflow-hidden border-b border-border pb-14 pt-36 sm:pt-40">
      <div className="pointer-events-none absolute inset-0 grid-bg [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />
      <div className="container-edge relative">
        {eyebrow && (
          <Reveal>
            <Badge>{eyebrow}</Badge>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
            {title}
          </h1>
        </Reveal>
        {description && (
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </header>
  );
}
