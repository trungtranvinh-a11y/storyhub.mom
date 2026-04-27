import Link from "next/link";
import { notFound } from "next/navigation";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { CharacterForm } from "@/modules/characters/components/character-form";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { listCharactersForProject } from "@/services/character-service";
import { Badge } from "@/shared/ui/badge";
import { buttonLinkClassName } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

function buildCharactersPageHref(projectId: string, sort: string, filter: string) {
  return `/app/projects/${projectId}/characters?sort=${sort}&filter=${filter}`;
}

export default async function CharactersPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ sort?: string; filter?: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const query = await searchParams;
  const sort = query.sort === "alphabetical" ? "alphabetical" : "confidence";
  const filter = query.filter === "candidates" || query.filter === "reviewed" ? query.filter : "all";
  const result = await listCharactersForProject(user.id, projectId, {
    sort,
    filter,
  });

  if (!result) {
    notFound();
  }

  return (
    <WorkspacePage
      actions={<Badge>{result.characters.length} characters</Badge>}
      description="Review detected and manually created character records here, then open a profile to refine aliases, first appearance, and continuity details."
      eyebrow="Character Review"
      title="Characters"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-5">
          <Card className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Review order</p>
              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                Confidence sorts by mention frequency first, so records near the top are more likely to be real recurring
                characters. Switch to A-Z when you want a manual cleanup pass.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex flex-wrap gap-2">
                <Link
                  className={buttonLinkClassName({
                    size: "sm",
                    variant: result.controls.sort === "confidence" ? "primary" : "secondary",
                  })}
                  href={buildCharactersPageHref(projectId, "confidence", result.controls.filter)}
                >
                  Confidence
                </Link>
                <Link
                  className={buttonLinkClassName({
                    size: "sm",
                    variant: result.controls.sort === "alphabetical" ? "primary" : "secondary",
                  })}
                  href={buildCharactersPageHref(projectId, "alphabetical", result.controls.filter)}
                >
                  A-Z
                </Link>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  className={buttonLinkClassName({
                    size: "sm",
                    variant: result.controls.filter === "all" ? "primary" : "secondary",
                  })}
                  href={buildCharactersPageHref(projectId, result.controls.sort, "all")}
                >
                  All
                </Link>
                <Link
                  className={buttonLinkClassName({
                    size: "sm",
                    variant: result.controls.filter === "candidates" ? "primary" : "secondary",
                  })}
                  href={buildCharactersPageHref(projectId, result.controls.sort, "candidates")}
                >
                  Candidates
                </Link>
                <Link
                  className={buttonLinkClassName({
                    size: "sm",
                    variant: result.controls.filter === "reviewed" ? "primary" : "secondary",
                  })}
                  href={buildCharactersPageHref(projectId, result.controls.sort, "reviewed")}
                >
                  Reviewed
                </Link>
              </div>
            </div>
          </Card>

          {result.characters.length ? (
            result.characters.map((character) => (
              <Card key={character.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge>{character.role}</Badge>
                      {character.isCandidate ? <Badge>Candidate</Badge> : null}
                      {character.mentionCount > 0 ? <Badge>{character.mentionCount} mentions</Badge> : null}
                      {character.status ? <Badge>{character.status}</Badge> : null}
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl text-[var(--color-ink)]">{character.name}</h3>
                      {character.alias ? <p className="mt-1 text-sm text-[var(--color-muted)]">Alias: {character.alias}</p> : null}
                    </div>
                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      {character.goal ?? character.notes ?? "Open the profile to fill in motivation, continuity notes, and linked chapter history."}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
                      <span>{character.mentionCount} mentions</span>
                      <span>{character._count.chapters} chapter links</span>
                      <span>{character._count.eventLinks} event links</span>
                      <span>
                        {character.firstAppearanceChapter
                          ? `First appears in Ch. ${character.firstAppearanceChapter.orderIndex}`
                          : "First appearance not set"}
                      </span>
                    </div>
                  </div>
                  <Link
                    className={buttonLinkClassName({ size: "sm", variant: "secondary" })}
                    href={`/app/projects/${projectId}/characters/${character.id}`}
                  >
                    Open profile
                  </Link>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                No characters yet. Imported candidate extraction and manual creation both feed this review list.
              </p>
            </Card>
          )}
        </div>

        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Manual character record</p>
          <h3 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">New profile</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Use this for cleanup or manual additions when the import pipeline misses someone important.
          </p>
          <div className="mt-6">
            <CharacterForm
              chapterOptions={[]}
              initialValues={{
                name: "",
                role: "",
                alias: "",
                gender: "",
                ageFirstAppearance: null,
                currentAge: null,
                occupation: "",
                status: "",
                goal: "",
                fear: "",
                secret: "",
                personality: "",
                appearance: "",
                notes: "",
                firstAppearanceChapterId: "",
              }}
              mode="create"
              projectId={projectId}
            />
          </div>
        </Card>
      </div>
    </WorkspacePage>
  );
}
