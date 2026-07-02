"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@run402/ui";

const NAV = [
  {
    group: "Get started",
    items: [
      { title: "Quick Start", href: "/" },
      { title: "Configuration", href: "/configuration" },
    ],
  },
  {
    group: "Guides",
    items: [
      { title: "CLI", href: "/cli" },
      { title: "Middleware", href: "/middleware" },
      { title: "Examples", href: "/examples" },
    ],
  },
  {
    group: "Reference",
    items: [
      { title: "Best Practices", href: "/best-practices" },
      { title: "Deployment", href: "/deployment" },
    ],
  },
  {
    group: "Help",
    items: [
      { title: "FAQ", href: "/faq" },
      { title: "Troubleshooting", href: "/troubleshooting" },
    ],
  },
];

export function DocsNav() {
  const pathname = usePathname();
  return (
    <nav className="space-y-6">
      {NAV.map((section) => (
        <div key={section.group}>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {section.group}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-md px-2.5 py-1.5 text-sm transition-colors",
                      active
                        ? "bg-muted font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
