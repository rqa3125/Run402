import { brands } from "@/components/ui/brands";
import { Reveal } from "@/components/ui/reveal";

export function WorksWith() {
  const loop = [...brands, ...brands];
  return (
    <section className="border-y border-border py-14">
      <div className="container-edge">
        <Reveal>
          <p className="text-center section-label">
            Works with the tools you already ship
          </p>
        </Reveal>
      </div>
      <div className="fade-mask-x relative mt-9 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-16 pr-16">
          {loop.map((brand, i) => (
            <div
              key={`${brand.name}-${i}`}
              className="flex shrink-0 items-center gap-2.5 text-muted-foreground/70 transition-colors hover:text-foreground"
              aria-hidden={i >= brands.length}
            >
              <brand.Icon className="h-5 w-auto" />
              <span className="text-[15px] font-medium tracking-tight">
                {brand.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
