"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { wordContainer, wordItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

type TextRevealProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  /** animate when scrolled into view (default) vs immediately on mount */
  trigger?: "inView" | "mount";
};

/**
 * Reveals text word-by-word with a blur + rise. Each word sits in an
 * overflow-clip wrapper so the motion reads as type settling into place.
 */
export function TextReveal({
  text,
  className,
  as = "span",
  delay = 0,
  trigger = "inView",
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.span;
  const words = text.split(" ");

  const animateProps =
    trigger === "mount"
      ? { animate: "show" as const }
      : {
          whileInView: "show" as const,
          viewport: { once: true, margin: "0px 0px -60px 0px" },
        };

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <MotionTag
      className={cn(className)}
      variants={wordContainer}
      initial="hidden"
      transition={{ delayChildren: delay }}
      {...animateProps}
      aria-label={text}
    >
      {words.map((word, i) => (
        <React.Fragment key={`${word}-${i}`}>
          <span
            className="inline-block overflow-hidden pb-[0.08em] align-bottom"
            aria-hidden
          >
            <motion.span variants={wordItem} className="inline-block">
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </React.Fragment>
      ))}
    </MotionTag>
  );
}
