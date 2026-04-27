import Link from "next/link";

import { Card } from "@/shared/ui/card";

export function AuthCard({
  eyebrow,
  title,
  description,
  switchCopy,
  switchHref,
  switchLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  switchCopy: string;
  switchHref: string;
  switchLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="relative overflow-hidden p-8 sm:p-10">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(158,118,78,0.5)] to-transparent" />
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
          {eyebrow}
        </p>
        <h1 className="font-serif text-4xl leading-none text-[var(--color-ink)] sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-md text-sm leading-6 text-[var(--color-muted)]">{description}</p>
      </div>

      <div className="mt-8">{children}</div>

      <p className="mt-6 text-sm text-[var(--color-muted)]">
        {switchCopy}{" "}
        <Link className="font-semibold text-[var(--color-ink)] underline-offset-4 hover:underline" href={switchHref}>
          {switchLabel}
        </Link>
      </p>
    </Card>
  );
}
