import type { Variants, Transition } from "framer-motion";

/** Shared easing curves — tuned for an Apple / Linear feel. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

/** Premium spring for hover lifts and magnetic motion. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.6,
};

export const springSnappy: Transition = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

/** Blur-reveal used across sections. */
export const revealUp: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE_OUT },
  },
};

/** Stagger container + item for grids and lists. */
export const staggerContainer = (stagger = 0.08, delay = 0.05): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};

/** Word-by-word reveal for headlines. */
export const wordContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.055, delayChildren: 0.05 },
  },
};

export const wordItem: Variants = {
  hidden: { opacity: 0, y: "0.5em", filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: "0em",
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE_OUT },
  },
};
