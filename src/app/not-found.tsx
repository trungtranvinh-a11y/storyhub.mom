import Link from "next/link";

import { buttonLinkClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[960px] items-center justify-center px-4 py-10">
      <Card className="max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">Not Found</p>
        <h1 className="mt-4 font-serif text-5xl text-[var(--color-ink)]">That story path does not exist.</h1>
        <p className="mt-4 text-sm leading-6 text-[var(--color-muted)]">
          The page may have been removed, the project may belong to another workspace, or the route is invalid.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link className={buttonLinkClassName({})} href="/app/projects">
            Go to projects
          </Link>
          <Link className={buttonLinkClassName({ variant: "secondary" })} href="/">
            Back home
          </Link>
        </div>
      </Card>
    </main>
  );
}
