"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-[960px] px-4 py-10">
      <Card className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Workspace Error</p>
        <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">Something went wrong in the story workspace.</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
          No project data was deleted. You can retry the render or navigate back to the project list.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Link className="inline-flex items-center justify-center rounded-full bg-white/70 px-4 py-3 text-sm font-medium ring-1 ring-[var(--color-line)]" href="/app/projects">
            Go to projects
          </Link>
        </div>
      </Card>
    </div>
  );
}
