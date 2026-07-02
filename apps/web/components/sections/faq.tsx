"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqs } from "@/content/faq";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section className="py-24 sm:py-28">
      <div className="container-edge">
        <SectionHeading label="FAQ" title="Questions, answered" />

        <div className="mx-auto mt-12 max-w-2xl divide-y divide-border border-y border-border">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[15px] font-medium">{item.q}</span>
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-45 bg-foreground text-background"
                    )}
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 pr-10 text-[15px] leading-relaxed text-muted-foreground">
                        {item.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
