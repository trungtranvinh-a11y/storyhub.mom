import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[rgba(122,87,52,0.14)] bg-[rgba(255,250,241,0.88)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
