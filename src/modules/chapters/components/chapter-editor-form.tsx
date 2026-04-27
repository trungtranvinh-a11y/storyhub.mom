"use client";

import { useActionState } from "react";

import { idleFormState } from "@/lib/form-state";
import { updateChapterAction } from "@/modules/chapters/actions/chapter-actions";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { FieldError, FormFeedback } from "@/shared/ui/form-feedback";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

type CharacterOption = {
  id: string;
  name: string;
  role: string;
};

export function ChapterEditorForm({
  projectId,
  chapterId,
  initialValues,
  characters,
  linkedCharacterIds,
}: {
  projectId: string;
  chapterId: string;
  initialValues: {
    title: string;
    orderIndex: number;
    summary?: string | null;
    content: string;
    status: string;
    timeInStory?: string | null;
    notes?: string | null;
  };
  characters: CharacterOption[];
  linkedCharacterIds: string[];
}) {
  const [state, formAction, isPending] = useActionState(
    updateChapterAction.bind(null, projectId, chapterId),
    idleFormState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="title">
            Chapter title
          </label>
          <Input defaultValue={initialValues.title} id="title" name="title" />
          <FieldError error={state.fieldErrors?.title} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="orderIndex">
            Order
          </label>
          <Input defaultValue={initialValues.orderIndex} id="orderIndex" name="orderIndex" type="number" />
          <FieldError error={state.fieldErrors?.orderIndex} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="status">
            Review status
          </label>
          <Select defaultValue={initialValues.status} id="status" name="status">
            <option value="DRAFT">Parsed</option>
            <option value="IN_PROGRESS">Needs cleanup</option>
            <option value="REVIEW">In review</option>
            <option value="FINAL">Verified</option>
          </Select>
          <FieldError error={state.fieldErrors?.status} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="timeInStory">
            Time in story
          </label>
          <Input defaultValue={initialValues.timeInStory ?? ""} id="timeInStory" name="timeInStory" placeholder="Day 3 - Before dawn" />
          <FieldError error={state.fieldErrors?.timeInStory} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="summary">
          Chapter summary
        </label>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Start from the parser draft, then tighten it into a useful review summary.
        </p>
        <Textarea className="min-h-[140px]" defaultValue={initialValues.summary ?? ""} id="summary" name="summary" />
        <FieldError error={state.fieldErrors?.summary} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="content">
          Parsed chapter text
        </label>
        <p className="text-sm leading-6 text-[var(--color-muted)]">
          Review this imported text block for split errors, missing headings, and normalization issues.
        </p>
        <Textarea className="min-h-[520px] bg-[rgba(255,250,241,0.9)] font-medium leading-7" defaultValue={initialValues.content} id="content" name="content" />
        <FieldError error={state.fieldErrors?.content} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="notes">
          Review notes
        </label>
        <Textarea className="min-h-[160px]" defaultValue={initialValues.notes ?? ""} id="notes" name="notes" placeholder="Parsing issues, chapter split concerns, continuity flags, review decisions..." />
        <FieldError error={state.fieldErrors?.notes} />
      </div>

      <div className="space-y-4 rounded-[28px] border border-[var(--color-line)] bg-white/50 p-5">
        <div className="space-y-2">
          <p className="text-sm font-medium text-[var(--color-ink)]">Linked characters</p>
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Select the characters who materially appear or matter in this chapter so the rest of the analysis stays grounded.
          </p>
        </div>

        <div className="grid gap-3">
          {characters.length ? (
            characters.map((character) => (
              <label
                className="flex items-start gap-3 rounded-2xl border border-[var(--color-line)] bg-white/70 px-4 py-3"
                htmlFor={`character-${character.id}`}
                key={character.id}
              >
                <input
                  defaultChecked={linkedCharacterIds.includes(character.id)}
                  id={`character-${character.id}`}
                  name="characterIds"
                  type="checkbox"
                  value={character.id}
                />
                <div>
                  <p className="font-medium text-[var(--color-ink)]">{character.name}</p>
                  <Badge className="mt-2">{character.role}</Badge>
                </div>
              </label>
            ))
          ) : (
            <p className="text-sm text-[var(--color-muted)]">No characters yet. Create them in the Character module first.</p>
          )}
        </div>
      </div>

      <FormFeedback message={state.message} tone={state.status === "success" ? "success" : "error"} />

      <Button disabled={isPending} size="lg" type="submit">
        {isPending ? "Saving..." : "Save chapter"}
      </Button>
    </form>
  );
}
