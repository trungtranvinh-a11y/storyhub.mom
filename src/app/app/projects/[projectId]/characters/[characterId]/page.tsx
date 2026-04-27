import { notFound } from "next/navigation";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { deleteCharacterAction } from "@/modules/characters/actions/character-actions";
import { CharacterForm } from "@/modules/characters/components/character-form";
import { CharacterMergeForm } from "@/modules/characters/components/character-merge-form";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { getCharacterForProject } from "@/services/character-service";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; characterId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId, characterId } = await params;
  const result = await getCharacterForProject(user.id, projectId, characterId);

  if (!result) {
    notFound();
  }

  return (
    <WorkspacePage
      actions={
        <div className="flex flex-wrap gap-3">
          <Badge>{result.character.role}</Badge>
          {result.character.isCandidate ? <Badge>Candidate</Badge> : null}
          {result.character.status ? <Badge>{result.character.status}</Badge> : null}
        </div>
      }
      description="This profile is fully editable and locked to the current project. Review detected data, refine aliases and first appearance, then keep only the fields that are truly useful."
      eyebrow="Character Detail"
      title="Character Profile"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CharacterForm
            chapterOptions={result.chapters.map((chapter) => ({
              id: chapter.id,
              label: `Chapter ${chapter.orderIndex}: ${chapter.title}`,
            }))}
            characterId={result.character.id}
            initialValues={{
              name: result.character.name,
              alias: result.character.alias,
              gender: result.character.gender,
              ageFirstAppearance: result.character.ageFirstAppearance,
              currentAge: result.character.currentAge,
              role: result.character.role,
              personality: result.character.personality,
              appearance: result.character.appearance,
              occupation: result.character.occupation,
              goal: result.character.goal,
              fear: result.character.fear,
              secret: result.character.secret,
              status: result.character.status,
              firstAppearanceChapterId: result.character.firstAppearanceChapterId,
              notes: result.character.notes,
            }}
            mode="update"
            projectId={projectId}
          />
        </Card>

        <div className="space-y-6">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Connected context</p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
              <li>
                First appearance:
                {" "}
                {result.character.firstAppearanceChapter
                  ? `Chapter ${result.character.firstAppearanceChapter.orderIndex}: ${result.character.firstAppearanceChapter.title}`
                  : "Not set"}
              </li>
              <li>Linked chapters: {result.character.chapters.length}</li>
              <li>Linked events: {result.character.eventLinks.length}</li>
              <li>Mention count: {result.character.mentionCount}</li>
              <li>Detection source: {result.character.detectionSource ?? "Manual"}</li>
            </ul>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Alias cleanup</p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Use merge when this record is really the same person as another detected character. This is especially
              useful after import when aliases or title-based names created duplicate candidates.
            </p>
            <div className="mt-4">
              <CharacterMergeForm characterId={characterId} projectId={projectId} targets={result.mergeTargets} />
            </div>
          </Card>

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Danger zone</p>
            <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
              Delete removes the character from this project workspace. Related join records are cleaned up by cascading foreign keys.
            </p>
            <form action={deleteCharacterAction.bind(null, projectId, characterId)} className="mt-4">
              <Button className="w-full bg-rose-600 text-white hover:bg-rose-700" type="submit">
                Delete character
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </WorkspacePage>
  );
}
