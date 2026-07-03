import { PageHeader } from "./page-header";

export type LegalSection = { heading: string; body: string[] };

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <PageHeader eyebrow={`Last updated ${updated}`} title={title} description={intro} />
      <section className="py-20">
        <div className="container-edge max-w-3xl">
          <div className="space-y-10">
            {sections.map((section, i) => (
              <div key={section.heading}>
                <h2 className="text-xl font-semibold tracking-tight">
                  <span className="mr-2 font-mono text-sm text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {section.body.map((p, j) => (
                    <p key={j} className="text-[15px] leading-relaxed text-muted-foreground">
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
            Questions about this policy? Email{" "}
            <a href="mailto:legal@run402.dev" className="text-foreground underline underline-offset-4">
              legal@run402.dev
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
