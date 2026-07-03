import Link from "next/link";
import { Github, MessagesSquare } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { site } from "@/lib/site";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Roadmap", href: "/#roadmap" },
      { label: "Changelog", href: "/changelog" },
      { label: "GitHub", href: site.github, external: true },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact" },
      { label: "GitHub", href: site.github, external: true },
      { label: "Discord", href: site.discord, external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-edge py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-600 dark:text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-beta-glow" />
                Public Beta
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              API infrastructure for the next generation. Built alongside early
              developers — wrap any route and start charging.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <Link
                href={site.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href={site.discord}
                target="_blank"
                rel="noreferrer"
                aria-label="Discord"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <MessagesSquare className="h-4 w-4" />
              </Link>
              <Link
                href={site.twitter}
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
              >
                <XIcon className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="section-label">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {site.name}. Building in Public since
            2026.
          </p>
          <p className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-beta-glow" />
            Public Beta
          </p>
        </div>
      </div>
    </footer>
  );
}
