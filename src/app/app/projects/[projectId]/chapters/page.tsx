import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { ChapterCreateForm } from "@/modules/chapters/components/chapter-create-form";
import { listChaptersForProject } from "@/services/chapter-service";
import { Badge } from "@/shared/ui/badge";
import { buttonLinkClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default async function ChaptersPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const result = await listChaptersForProject(user.id, projectId);

  if (!result) {
    notFound();
  }

  return (
    <WorkspacePage
      actions={<Badge>{result.chapters.length} chapters</Badge>}
      description="Review chapter records, summaries, and linked entities inside the project workspace. Later phases will replace manual creation-first flow with import-first parsing."
      eyebrow="Chapter Review"
      title="Chapters"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-5">
          {result.chapters.length ? (
            result.chapters.map((chapter) => (
              <Card key={chapter.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge>Chapter {chapter.orderIndex}</Badge>
                      <Badge>{chapter.status.replaceAll("_", " ")}</Badge>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-ink)]">{chapter.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                        {chapter.summary ?? "No summary yet. Open the chapter detail page to review or add metadata."}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
                      <span>{chapter._count.linkedCharacters} linked characters</span>
                      <span>{chapter._count.events} events</span>
                      <span>{chapter._count.plotThreads} plot threads</span>
                    </div>
                  </div>
                  <Link
                    className={buttonLinkClassName({ size: "sm", variant: "secondary" })}
                    href={`/app/projects/${projectId}/chapters/${chapter.id}`}
                  >
                    Open
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                No chapters yet. In the new product direction, these will primarily come from import and chapter splitting.
              </p>
            </Card>
          )}
        </div>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Temporary manual entry</p>
          <h3 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">Manual chapter record</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            This manual form stays available temporarily for cleanup and testing. The primary MVP flow will move to import and parse.
          </p>
          <div className="mt-6">
            <ChapterCreateForm projectId={projectId} />
          </div>
        </Card>
      </div>
    </WorkspacePage>
  );
}
