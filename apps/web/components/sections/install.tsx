"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { CopyButton } from "@/components/ui/copy-button";
import { WindowDots } from "@/components/ui/code-block";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "npm", cmd: "npm install run402" },
  { id: "pnpm", cmd: "pnpm add run402" },
  { id: "bun", cmd: "bun add run402" },
  { id: "yarn", cmd: "yarn add run402" },
] as const;

export function Install() {
  const [active, setActive] = React.useState<(typeof tabs)[number]["id"]>("npm");
  const current = tabs.find((t) => t.id === active)!;

  return (
    <section className="py-24 sm:py-28">
      <div className="container-edge">
        <SectionHeading
          label="Installation"
          title="Up and running in one command"
          description="Add Run402 to any Node.js project with your package manager of choice."
        />

        <Reveal className="mx-auto mt-12 max-w-2xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2.5">
              <div className="flex items-center gap-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActive(t.id)}
                    className={cn(
                      "relative rounded-full px-3.5 py-1.5 font-mono text-xs transition-colors",
                      active === t.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {active === t.id && (
                      <motion.span
                        layoutId="install-tab"
                        className="absolute inset-0 rounded-full bg-background shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span className="relative">{t.id}</span>
                  </button>
                ))}
              </div>
              <WindowDots />
            </div>
            <div className="flex items-center justify-between gap-4 px-5 py-6">
              <code className="flex items-center gap-3 font-mono text-sm sm:text-[15px]">
                <Terminal className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span>
                  <span className="text-muted-foreground">$ </span>
                  <motion.span
                    key={current.cmd}
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25 }}
                    className="inline-block"
                  >
                    {current.cmd}
                  </motion.span>
                </span>
              </code>
              <CopyButton value={current.cmd} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
