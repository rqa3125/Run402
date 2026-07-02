"use client";

import * as React from "react";

/** Fires once when the element scrolls into view. */
export function useInViewOnce<T extends Element>(rootMargin = "0px") {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin, threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inView, rootMargin]);

  return { ref, inView };
}
