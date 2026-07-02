import { Reveal } from "./reveal";
import { TextReveal } from "./text-reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
  className,
}: {
  label?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {label && (
        <Reveal>
          <p className="section-label">{label}</p>
        </Reveal>
      )}
      {typeof title === "string" ? (
        <TextReveal
          as="h2"
          text={title}
          delay={0.05}
          className="mt-3 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]"
        />
      ) : (
        <Reveal delay={0.05}>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]">
            {title}
          </h2>
        </Reveal>
      )}
      {description && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
