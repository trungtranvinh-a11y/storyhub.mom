import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = {
  primary:
    "border border-[rgba(25,89,79,0.18)] bg-[linear-gradient(180deg,rgba(39,112,101,1),rgba(25,85,77,1))] !text-white shadow-[0_18px_42px_-24px_rgba(23,80,72,0.58)] hover:-translate-y-0.5 hover:!text-white hover:shadow-[0_20px_46px_-24px_rgba(23,80,72,0.7)] [&_svg]:!text-white [&_span]:!text-white",
  secondary:
    "bg-white/82 text-[var(--color-ink)] ring-1 ring-[var(--color-line)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] hover:-translate-y-0.5 hover:bg-white",
  ghost:
    "bg-transparent text-[var(--color-ink)] hover:bg-white/50",
  outline:
    "bg-transparent text-[var(--color-ink)] ring-1 ring-[var(--color-line)] hover:bg-white/60",
} as const;

const buttonSizes = {
  default: "h-11 px-4 text-sm",
  sm: "h-9 px-3 text-sm",
  lg: "h-12 px-5 text-base",
} as const;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
};

export function Button({
  className,
  variant = "primary",
  size = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl font-medium no-underline transition duration-200 disabled:pointer-events-none disabled:opacity-60",
        buttonVariants[variant],
        buttonSizes[size],
        className,
      )}
      type={type}
      {...props}
    />
  );
}

export function buttonLinkClassName({
  className,
  size = "default",
  variant = "primary",
}: {
  className?: string;
  size?: keyof typeof buttonSizes;
  variant?: keyof typeof buttonVariants;
}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-2xl font-medium no-underline transition duration-200",
    buttonVariants[variant],
    buttonSizes[size],
    className,
  );
}
