import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessagesSquare, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { ContactForm } from "@/components/sections/contact-form";
import { Reveal } from "@/components/ui/reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Talk to the Run402 team about pricing, enterprise, or getting your API monetized.",
};

const channels = [
  { icon: Mail, title: "Email", body: "hello@run402.dev", href: "mailto:hello@run402.dev" },
  { icon: MessagesSquare, title: "Discord", body: "Join the community", href: site.discord },
  { icon: BookOpen, title: "Docs", body: "Read the guides", href: "/docs" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let’s get your API earning"
        description="Questions about pricing, enterprise, or integration? Send us a note — we usually reply within a business day."
      />

      <section className="py-20">
        <div className="container-edge grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Other ways to reach us
            </h2>
            <div className="mt-6 grid gap-3">
              {channels.map((c) => (
                <Reveal key={c.title}>
                  <Link
                    href={c.href}
                    className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted/50">
                      <c.icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{c.title}</span>
                      <span className="block text-sm text-muted-foreground">
                        {c.body}
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
