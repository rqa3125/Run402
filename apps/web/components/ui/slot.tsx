import * as React from "react";

/**
 * Minimal Slot: merges its props onto a single child element.
 * Enough for the `asChild` pattern without pulling in @radix-ui/react-slot.
 */
export const Slot = React.forwardRef<HTMLElement, { children?: React.ReactNode } & Record<string, unknown>>(
  ({ children, ...props }, ref) => {
    if (!React.isValidElement(children)) return null;
    const child = children as React.ReactElement<Record<string, unknown>>;
    return React.cloneElement(child, {
      ...props,
      ...child.props,
      className: [props.className, child.props.className]
        .filter(Boolean)
        .join(" "),
      ref,
    } as Record<string, unknown>);
  }
);
Slot.displayName = "Slot";
