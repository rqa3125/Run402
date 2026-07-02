"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin reading-progress bar pinned under the navbar. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[2px] origin-left bg-foreground/80"
      aria-hidden
    />
  );
}
