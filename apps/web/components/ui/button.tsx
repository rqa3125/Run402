import * as React from "react";
import { Slot } from "./slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn relative isolate inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full text-sm font-medium transition-[transform,box-shadow,background-color,color] duration-300 ease-out will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] active:duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-0 before:-translate-x-[130%] before:bg-[linear-gradient(115deg,transparent,hsl(var(--background)/0.35),transparent)] before:transition-transform before:duration-[900ms] before:ease-out before:content-[''] hover:before:translate-x-[130%]",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-background hover:bg-foreground shadow-soft hover:shadow-lift",
        secondary:
          "bg-transparent text-foreground border border-border hover:bg-muted hover:border-foreground/20 before:hidden",
        ghost: "bg-transparent text-foreground hover:bg-muted before:hidden",
        link: "text-foreground underline-offset-4 hover:underline px-0 before:hidden hover:translate-y-0",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-6",
        lg: "h-12 px-7 text-[15px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
