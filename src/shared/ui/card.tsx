import * as React from "react";

import { cn } from "@/lib/utils";

export const Card = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "rounded-[24px] border border-white/70 bg-[var(--color-surface)] p-6 shadow-[var(--shadow-panel)] backdrop-blur-xl",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";
