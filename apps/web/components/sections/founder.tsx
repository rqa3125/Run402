"use client";

import * as React from "react";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";

const badges = ["IIT (ISM) Dhanbad", "Bottomline Technologies", "Bengaluru"];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/manojpaliwal",
    icon: Linkedin,
    active: true,
  },
  { label: "GitHub", href: "#", icon: Github, active: false },
  { label: "X", href: "#", icon: XIcon, active: false },
  { label: "Email", href: "#", icon: Mail, active: false },
];

export function Founder() {
  return (
    <section className="border-y border-border bg-muted/30 py-24 sm:py-28">
      <div className="container-edge">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
          {/* portrait */}
          <Reveal>
            <div className="group relative mx-auto w-full max-w-sm">
              <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-foreground/[0.04] blur-2xl transition-opacity duration-500 group-hover:opacity-80" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border bg-muted shadow-soft transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-glow">
                {/* Elegant monogram fallback until public/founder.jpg is added. */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-background">
                  <span className="select-none text-6xl font-semibold tracking-tight text-muted-foreground/40">
                    MP
                  </span>
                </div>
                {/* Founder portrait — drop the provided image at public/founder.jpg */}
                <img
                  src="/founder.jpg"
                  alt="Manoj Paliwal, Founder of Run402"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="relative h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
            </div>
          </Reveal>

          {/* content */}
          <div>
            <Reveal>
              <p className="section-label">Meet the Founder</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                Manoj Paliwal
              </h2>
              <p className="mt-1.5 text-lg text-muted-foreground">
                Founder &amp; Software Engineer
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-5 flex flex-wrap gap-2">
                {badges.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-6 space-y-4 text-pretty text-[15px] leading-relaxed text-muted-foreground">
                <p>
                  Manoj is building Run402 with a simple vision: making API
                  monetization as easy as adding a single middleware.
                </p>
                <p>
                  After working as a software engineer and building developer
                  tools, he realized monetizing APIs is still far more
                  complicated than it should be. Run402 exists to change that.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {socials.map((s) =>
                  s.active ? (
                    <Link
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={s.label}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/25 hover:shadow-md"
                    >
                      <s.icon className="h-4 w-4" />
                      {s.label}
                    </Link>
                  ) : (
                    <span
                      key={s.label}
                      aria-disabled
                      title="Coming soon"
                      className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-border/60 bg-background/40 px-4 py-2 text-sm font-medium text-muted-foreground/50"
                    >
                      <s.icon className="h-4 w-4" />
                      {s.label}
                    </span>
                  )
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
