import * as React from "react";

import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    return (
      <input
        className={cn(
          "h-11 w-full rounded-[18px] border border-[rgba(77,100,125,0.14)] bg-[rgba(255,255,255,0.72)] px-4 text-sm text-[var(--color-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:bg-white focus:ring-4 focus:ring-[rgba(47,127,114,0.12)]",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
