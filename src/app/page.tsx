import { ArrowRight, BookHeart, LayoutDashboard, ScrollText, Users2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/modules/auth/server/session";
import { Badge } from "@/shared/ui/badge";
import { buttonLinkClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

const highlights = [
  {
    title: "Project overview",
    copy: "Track one story project at a time with project-level context, counts, and review status anchored in one place.",
    icon: LayoutDashboard,
  },
  {
    title: "Character review",
    copy: "Review detected characters, clean up roles and aliases, and keep first appearances tied to the right chapters.",
    icon: Users2,
  },
  {
    title: "Chapter parsing",
    copy: "Import story text, split it into chapters, and review summaries and events before analysis data becomes canonical.",
    icon: ScrollText,
  },
];

export default async function HomePage() {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect("/app/projects");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_420px]">
        <Card className="overflow-hidden p-8 sm:p-10 lg:p-14">
          <Badge>Text Story Tracking & Analysis Workspace</Badge>
          <div className="mt-6 max-w-4xl space-y-6">
            <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] text-[var(--color-ink)] sm:text-6xl lg:text-7xl">
              Import story text, turn it into structured data, and review the story with clarity.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--color-muted)] sm:text-lg">
              This workspace is designed for long-form fiction analysis. Projects, chapters, characters, timeline events,
              and plot threads stay organized so imported text becomes reviewable and searchable instead of chaotic.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link className={buttonLinkClassName({ size: "lg" })} href="/register">
              Start tracking a story
              <ArrowRight className="size-4" />
            </Link>
            <Link className={buttonLinkClassName({ size: "lg", variant: "secondary" })} href="/login">
              Sign in
            </Link>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {highlights.map(({ title, copy, icon: Icon }) => (
              <div className="rounded-[24px] border border-[var(--color-line)] bg-white/60 p-5" key={title}>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(158,118,78,0.12)]">
                  <Icon className="size-5 text-[var(--color-accent)]" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-[var(--color-ink)]">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{copy}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="bg-[rgba(38,30,22,0.96)] text-white">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-[rgba(241,223,193,0.14)]">
                <BookHeart className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[rgba(241,223,193,0.7)]">MVP Focus</p>
                <p className="font-serif text-3xl">Structured text analysis flow</p>
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm leading-6 text-[rgba(241,223,193,0.8)]">
              <p>Auth, protected routes, project shell, chapters, characters, events, and plot threads already exist as a solid base.</p>
              <p>The refactor shifts the product toward import, parse, review, and dashboard workflows instead of AI-assisted writing.</p>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">What this app avoids</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
              <li>Not an AI writing assistant and not a blank editor with generation buttons.</li>
              <li>No cross-project data leakage between writing workspaces.</li>
              <li>No premature collaboration, OCR pipelines, graph systems, or export complexity in the MVP.</li>
            </ul>
          </Card>
        </div>
      </div>
    </main>
  );
}
