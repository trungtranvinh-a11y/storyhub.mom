import Link from "next/link";
import { ArrowRight, BookOpenText, Clock3, ScrollText, Sparkles, Swords, Users2 } from "lucide-react";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { listProjectsForUser } from "@/services/project-service";
import { Badge } from "@/shared/ui/badge";
import { buttonLinkClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default async function ProjectsPage() {
  const user = await requireAuthenticatedUser();
  const projects = await listProjectsForUser(user.id);

  return (
    <WorkspacePage
      actions={
        <Link className={buttonLinkClassName({})} href="/app/projects/new">
          Create project
        </Link>
      }
      description="Open an analysis project or start a new one. Every project keeps imported chapters, detected characters, events, and tracking notes together."
      eyebrow="Projects"
      title="Project Library"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-y-0 right-0 w-56 bg-[radial-gradient(circle_at_right,rgba(158,118,78,0.18),transparent_68%)]" />
            <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <Badge>Library snapshot</Badge>
                <h3 className="mt-4 font-serif text-4xl text-[var(--color-ink)]">Keep every story corpus organized before manual review gets messy.</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                  Project data is user-scoped, persisted in PostgreSQL, and ready to support import, parse, review, and tracking flows without cross-project leakage.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-[rgba(122,87,52,0.12)] bg-[rgba(255,250,241,0.78)] p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Projects</p>
                  <p className="mt-2 font-serif text-4xl text-[var(--color-ink)]">{projects.length}</p>
                </div>
                <div className="rounded-[24px] border border-[rgba(122,87,52,0.12)] bg-[rgba(54,43,31,0.95)] p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.22em] text-[rgba(241,223,193,0.72)]">Next move</p>
                  <p className="mt-2 text-sm leading-6">Open a project dashboard to review imported chapters, cast, timeline, and plot pressure at a glance.</p>
                </div>
              </div>
            </div>
          </Card>

          {projects.length ? (
            projects.map((project) => (
              <Card className="relative overflow-hidden" key={project.id}>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-48 bg-[radial-gradient(circle_at_right,rgba(158,118,78,0.14),transparent_72%)]" />
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="relative space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge>{project.status.replaceAll("_", " ")}</Badge>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">{project.genre}</p>
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl text-[var(--color-ink)]">{project.title}</h3>
                      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--color-muted)]">{project.synopsis}</p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
                      <span className="inline-flex items-center gap-2">
                        <BookOpenText className="size-4" />
                        {project._count.chapters} chapters
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Users2 className="size-4" />
                        {project._count.characters} characters
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Swords className="size-4" />
                        {project._count.plotThreads} threads
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <ScrollText className="size-4" />
                        {project._count.events} events
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="size-4" />
                        Updated {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="relative flex flex-wrap gap-3">
                    <Link className={buttonLinkClassName({ size: "sm" })} href={`/app/projects/${project.id}/dashboard`}>
                      <ArrowRight className="size-4" />
                      Open project
                    </Link>
                    <Link
                      className={buttonLinkClassName({ size: "sm", variant: "secondary" })}
                      href={`/app/projects/${project.id}/settings`}
                    >
                      Edit settings
                    </Link>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Empty state</p>
              <h3 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">No story projects yet</h3>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
                Create your first project to start importing story text and structuring chapters, characters, timeline events, and plot threads around one consistent corpus.
              </p>
              <div className="mt-6">
                <Link className={buttonLinkClassName({})} href="/app/projects/new">
                  Start your first project
                </Link>
              </div>
            </Card>
          )}
        </div>

        <Card className="space-y-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Workspace guide</p>
            <h3 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">A cleaner way to review long-form fiction as data.</h3>
          </div>
          <div className="space-y-3 text-sm leading-6 text-[var(--color-muted)]">
            <div className="rounded-[24px] border border-[rgba(122,87,52,0.12)] bg-[rgba(255,250,241,0.82)] p-4">
              <div className="flex items-center gap-2 text-[var(--color-ink)]">
                <Sparkles className="size-4 text-[var(--color-accent-strong)]" />
                <span className="font-medium">Project-safe architecture</span>
              </div>
              <p className="mt-2">Each project is isolated by user and scope, so imported chapters, cast, events, and review data stay in the correct story.</p>
            </div>
            <div className="rounded-[24px] border border-[rgba(122,87,52,0.12)] bg-[rgba(255,250,241,0.82)] p-4">
              <p className="font-medium text-[var(--color-ink)]">Suggested flow</p>
              <p className="mt-2">Start with a project, import text, review split chapters, then clean up characters, timeline events, and plot-thread continuity.</p>
            </div>
          </div>
        </Card>
      </div>
    </WorkspacePage>
  );
}
