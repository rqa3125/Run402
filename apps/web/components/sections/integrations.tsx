"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { brands } from "@/components/ui/brands";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { staggerContainer, staggerItem } from "@/components/ui/reveal";

export function Integrations() {
  return (
    <section className="py-24 sm:py-28">
      <div className="container-edge">
        <SectionHeading
          label="Integrations"
          title="Plays nicely with your stack"
          description="Drop Run402 into the frameworks, runtimes, and platforms you already use."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {brands.map((b) => (
            <SpotlightCard
              key={b.name}
              variants={staggerItem}
              lift={-5}
              className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card px-4 py-8 text-muted-foreground shadow-soft transition-[color,box-shadow] hover:text-foreground hover:shadow-lift"
            >
              <span className="transition-transform duration-300 group-hover:scale-110">
                <b.Icon className="h-7 w-auto" />
              </span>
              <span className="text-sm font-medium tracking-tight">
                {b.name}
              </span>
            </SpotlightCard>
          ))}
          <motion.div
            variants={staggerItem}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border px-4 py-8 text-muted-foreground"
          >
            <Plus className="h-7 w-7" />
            <span className="text-sm font-medium tracking-tight">
              More soon
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
