import Link from "next/link";
import { Activity, ArrowRight, BookOpenText, Clock3, ScrollText, Swords, Upload, Users2 } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { getProjectDashboardSnapshot } from "@/services/project-service";
import { Badge } from "@/shared/ui/badge";
import { buttonLinkClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default async function ProjectDashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const project = await getProjectDashboardSnapshot(user.id, projectId);

  if (!project) {
    notFound();
  }

  const stats = [
    { label: "Chapters", value: String(project._count.chapters), note: project.latestChapter?.title ?? "No chapters yet" },
    {
      label: "Characters",
      value: String(project._count.characters),
      note: project._count.characters ? "Detected and reviewed character records live here." : "No character records yet.",
    },
    {
      label: "Import jobs",
      value: String(project._count.importJobs),
      note: project.latestImportJob?.filename ?? "No imports yet",
    },
    {
      label: "Active plot threads",
      value: String(project.activePlotThreadCount),
      note: project.activePlotThreadCount ? "Plot threads already connected to this workspace." : "No active plot threads yet.",
    },
  ];

  return (
    <WorkspacePage
      actions={
        <>
          <Link className={buttonLinkClassName({ variant: "secondary" })} href="./imports">
            Open imports
          </Link>
          <Link className={buttonLinkClassName({ variant: "secondary" })} href="./chapters">
            Open chapters
          </Link>
          <Link className={buttonLinkClassName({})} href="./characters">
            Review characters
          </Link>
        </>
      }
      description="Use this page as the control room for the current story: review imported chapters, cast, timeline movement, and which threads still need tracking."
      eyebrow="Project Overview"
      title="Dashboard"
    >
      <div className="space-y-6">
        <Card className="relative overflow-hidden rounded-[24px] border border-white/80 bg-[linear-gradient(135deg,rgba(24,40,58,0.98),rgba(25,85,77,0.92))] text-white">
          <div className="absolute inset-y-0 right-0 w-72 bg-[radial-gradient(circle_at_right,rgba(132,224,204,0.22),transparent_68%)]" />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="relative space-y-3">
              <div className="flex flex-wrap gap-3">
                <Badge className="border-white/16 bg-white/10 text-white">{project.status.replaceAll("_", " ")}</Badge>
                <Badge className="border-white/16 bg-white/10 text-white">{project.genre}</Badge>
                {project.targetAudience ? <Badge className="border-white/16 bg-white/10 text-white">{project.targetAudience}</Badge> : null}
              </div>
              <h3 className="font-serif text-4xl text-white">{project.title}</h3>
              <p className="max-w-4xl text-sm leading-6 text-[rgba(226,239,245,0.78)]">{project.synopsis}</p>
            </div>
            <Link className={buttonLinkClassName({ variant: "secondary", className: "bg-white/14 text-white ring-white/10 hover:bg-white/18" })} href={`/app/projects/${project.id}/settings`}>
              Edit project
            </Link>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-4">
          {stats.map((stat) => (
            <Card className="relative overflow-hidden rounded-[22px] bg-[rgba(255,255,255,0.72)]" key={stat.label}>
              <div className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(47,127,114,0.45),transparent)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">{stat.label}</p>
              <p className="mt-4 font-serif text-5xl text-[var(--color-ink)]">{stat.value}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{stat.note}</p>
            </Card>
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <Card className="space-y-5 rounded-[24px]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Quick actions</p>
              <h3 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">Use this like a control center, not a landing page.</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <Link className={buttonLinkClassName({ variant: "secondary", className: "justify-between rounded-[20px] border border-white/80 px-5 py-4 shadow-none" })} href={`/app/projects/${project.id}/imports`}>
                <span className="inline-flex items-center gap-2"><Upload className="size-4" /> Open imports</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link className={buttonLinkClassName({ variant: "secondary", className: "justify-between rounded-[20px] border border-white/80 px-5 py-4 shadow-none" })} href={`/app/projects/${project.id}/chapters`}>
                <span className="inline-flex items-center gap-2"><BookOpenText className="size-4" /> Open chapters</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link className={buttonLinkClassName({ variant: "secondary", className: "justify-between rounded-[20px] border border-white/80 px-5 py-4 shadow-none" })} href={`/app/projects/${project.id}/characters`}>
                <span className="inline-flex items-center gap-2"><Users2 className="size-4" /> Review characters</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link className={buttonLinkClassName({ variant: "secondary", className: "justify-between rounded-[20px] border border-white/80 px-5 py-4 shadow-none" })} href={`/app/projects/${project.id}/timeline`}>
                <span className="inline-flex items-center gap-2"><ScrollText className="size-4" /> Check timeline</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link className={buttonLinkClassName({ variant: "secondary", className: "justify-between rounded-[20px] border border-white/80 px-5 py-4 shadow-none" })} href={`/app/projects/${project.id}/plot-threads`}>
                <span className="inline-flex items-center gap-2"><Swords className="size-4" /> Watch plot threads</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </Card>

          <Card className="space-y-4 rounded-[24px]">
            <div className="flex items-center gap-2 text-[var(--color-ink)]">
              <Activity className="size-4 text-[var(--color-accent-strong)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Recent focus</p>
            </div>
            <div className="rounded-[20px] border border-[rgba(77,100,125,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Latest import</p>
              <p className="mt-2 font-serif text-2xl text-[var(--color-ink)]">{project.latestImportJob?.filename ?? "No import yet"}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {project.latestImportJob
                  ? `${project.latestImportJob.chapterCount} chapters, ${project.latestImportJob.characterCandidateCount} character candidates, ${project.latestImportJob.eventDraftCount} event drafts.`
                  : "Imported source documents and their parsing results will show up here first."}
              </p>
            </div>
            <div className="rounded-[20px] border border-[rgba(77,100,125,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Latest chapter</p>
              <p className="mt-2 font-serif text-2xl text-[var(--color-ink)]">{project.latestChapter?.title ?? "No chapter yet"}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {project.latestChapter ? "Open the latest chapter to review parsed text, summary quality, and linked characters." : "Imported or manually added chapters will show up here first."}
              </p>
            </div>
            <div className="rounded-[20px] border border-[rgba(77,100,125,0.12)] bg-[rgba(255,255,255,0.68)] p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Latest event</p>
              <p className="mt-2 font-serif text-2xl text-[var(--color-ink)]">{project.latestEvent?.title ?? "No event yet"}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {project.latestEvent?.timeMarker
                  ? `Time marker: ${project.latestEvent.timeMarker}`
                  : "Timeline events help preserve cause-and-effect across long arcs."}
              </p>
            </div>
            <div className="rounded-[20px] border border-[rgba(77,100,125,0.12)] bg-[rgba(226,244,240,0.74)] p-4">
              <div className="flex items-center gap-2">
                <Clock3 className="size-4 text-[var(--color-accent-strong)]" />
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Workflow hint</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--color-ink)]">
                Best flow: import source text, review top character candidates, then confirm timeline and unresolved plot threads.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </WorkspacePage>
  );
}
