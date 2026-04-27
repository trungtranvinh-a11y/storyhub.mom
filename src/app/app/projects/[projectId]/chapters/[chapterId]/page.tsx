import { BookOpenText, ShieldCheck, Tags } from "lucide-react";
import { notFound } from "next/navigation";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { ChapterEditorForm } from "@/modules/chapters/components/chapter-editor-form";
import { getChapterForProject } from "@/services/chapter-service";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";

export default async function ChapterEditorPage({
  params,
}: {
  params: Promise<{ projectId: string; chapterId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId, chapterId } = await params;
  const result = await getChapterForProject(user.id, projectId, chapterId);

  if (!result) {
    notFound();
  }

  return (
    <WorkspacePage
      actions={
        <>
          <Button variant="secondary">
            <BookOpenText className="size-4" />
            Review chapter metadata below
          </Button>
        </>
      }
      description="Use this page to review parsed chapter text, clean up metadata, and verify linked characters before the rest of the analysis depends on it."
      eyebrow="Chapter Review"
      title="Chapter Detail"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden">
          <ChapterEditorForm
            chapterId={chapterId}
            characters={result.characters}
            initialValues={{
              title: result.chapter.title,
              orderIndex: result.chapter.orderIndex,
              summary: result.chapter.summary,
              content: result.chapter.content,
              status: result.chapter.status,
              timeInStory: result.chapter.timeInStory,
              notes: result.chapter.notes,
            }}
            linkedCharacterIds={result.chapter.linkedCharacters.map((link) => link.characterId)}
            projectId={projectId}
          />
        </Card>

        <div className="space-y-6">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Review checklist</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-[24px] border border-[rgba(122,87,52,0.12)] bg-[rgba(255,250,241,0.8)] p-4">
                <div className="flex items-center gap-2 text-[var(--color-ink)]">
                  <BookOpenText className="size-4 text-[var(--color-accent-strong)]" />
                  <span className="font-medium">Text sanity</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Confirm the chapter title, order, summary, and raw text all match the imported source.
                </p>
              </div>
              <div className="rounded-[24px] border border-[rgba(122,87,52,0.12)] bg-[rgba(255,250,241,0.8)] p-4">
                <div className="flex items-center gap-2 text-[var(--color-ink)]">
                  <Tags className="size-4 text-[var(--color-accent-strong)]" />
                  <span className="font-medium">Linked data</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                  Verify the correct characters are linked so later event and continuity review starts from a clean base.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(158,118,78,0.12)] text-[var(--color-accent-strong)]">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Tracking rule</p>
                <p className="mt-1 text-sm leading-6 text-[var(--color-muted)]">
                  Imported text should remain reviewable. Automatic writing and generation flows are disabled in this product direction.
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Linked characters</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {result.chapter.linkedCharacters.length ? (
                result.chapter.linkedCharacters.map((link) => <Badge key={link.characterId}>{link.character.name}</Badge>)
              ) : (
                <p className="text-sm leading-6 text-[var(--color-muted)]">No character links yet.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </WorkspacePage>
  );
}
