import { Card } from "@/shared/ui/card";

export function WorkspacePage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,rgba(248,251,255,0.88),rgba(243,248,252,0.74))]">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-72 bg-[radial-gradient(circle_at_right,rgba(47,127,114,0.18),transparent_68%)]" />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="relative space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-muted)]">
              {eyebrow}
            </p>
            <div>
              <h2 className="font-serif text-4xl leading-none text-[var(--color-ink)] md:text-[3rem]">{title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">{description}</p>
            </div>
          </div>
          {actions ? <div className="relative flex flex-wrap items-center gap-3">{actions}</div> : null}
        </div>
      </Card>
      {children}
    </div>
  );
}
