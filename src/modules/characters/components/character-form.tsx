"use client";

import { useActionState } from "react";

import { idleFormState } from "@/lib/form-state";
import { createCharacterAction, updateCharacterAction } from "@/modules/characters/actions/character-actions";
import { Button } from "@/shared/ui/button";
import { FieldError, FormFeedback } from "@/shared/ui/form-feedback";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

type ChapterOption = {
  id: string;
  label: string;
};

type CharacterFormValues = {
  name: string;
  alias?: string | null;
  gender?: string | null;
  ageFirstAppearance?: number | null;
  currentAge?: number | null;
  role: string;
  personality?: string | null;
  appearance?: string | null;
  occupation?: string | null;
  goal?: string | null;
  fear?: string | null;
  secret?: string | null;
  status?: string | null;
  firstAppearanceChapterId?: string | null;
  notes?: string | null;
};

export function CharacterForm({
  mode,
  projectId,
  characterId,
  initialValues,
  chapterOptions,
}: {
  mode: "create" | "update";
  projectId: string;
  characterId?: string;
  initialValues: CharacterFormValues;
  chapterOptions: ChapterOption[];
}) {
  const action =
    mode === "create"
      ? createCharacterAction.bind(null, projectId)
      : updateCharacterAction.bind(null, projectId, characterId ?? "");
  const [state, formAction, isPending] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="name">
          Name
        </label>
        <Input defaultValue={initialValues.name} id="name" name="name" placeholder="Aren Vale" />
        <FieldError error={state.fieldErrors?.name} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="role">
          Role / review label
        </label>
        <Input defaultValue={initialValues.role} id="role" name="role" placeholder="Detected character candidate" />
        <FieldError error={state.fieldErrors?.role} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="alias">
          Alias or alternate name
        </label>
        <Input defaultValue={initialValues.alias ?? ""} id="alias" name="alias" placeholder="Optional alias" />
        <FieldError error={state.fieldErrors?.alias} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="gender">
          Gender
        </label>
        <Input defaultValue={initialValues.gender ?? ""} id="gender" name="gender" placeholder="Optional" />
        <FieldError error={state.fieldErrors?.gender} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="ageFirstAppearance">
          Age at first appearance
        </label>
        <Input defaultValue={initialValues.ageFirstAppearance?.toString() ?? ""} id="ageFirstAppearance" name="ageFirstAppearance" placeholder="18" type="number" />
        <FieldError error={state.fieldErrors?.ageFirstAppearance} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="currentAge">
          Current age
        </label>
        <Input defaultValue={initialValues.currentAge?.toString() ?? ""} id="currentAge" name="currentAge" placeholder="19" type="number" />
        <FieldError error={state.fieldErrors?.currentAge} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="occupation">
          Occupation
        </label>
        <Input defaultValue={initialValues.occupation ?? ""} id="occupation" name="occupation" placeholder="Courier" />
        <FieldError error={state.fieldErrors?.occupation} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="status">
          Status
        </label>
        <Input defaultValue={initialValues.status ?? ""} id="status" name="status" placeholder="Alive, missing, injured..." />
        <FieldError error={state.fieldErrors?.status} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="firstAppearanceChapterId">
          First appearance chapter
        </label>
        <Select defaultValue={initialValues.firstAppearanceChapterId ?? ""} id="firstAppearanceChapterId" name="firstAppearanceChapterId">
          <option value="">Not set</option>
          {chapterOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError error={state.fieldErrors?.firstAppearanceChapterId} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="personality">
          Personality
        </label>
        <Textarea defaultValue={initialValues.personality ?? ""} id="personality" name="personality" placeholder="Temperament, contradictions, habits..." />
        <FieldError error={state.fieldErrors?.personality} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="appearance">
          Appearance
        </label>
        <Textarea defaultValue={initialValues.appearance ?? ""} id="appearance" name="appearance" placeholder="Visual notes and recognizable details..." />
        <FieldError error={state.fieldErrors?.appearance} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="goal">
          Goal
        </label>
        <Textarea className="min-h-[120px]" defaultValue={initialValues.goal ?? ""} id="goal" name="goal" placeholder="What do they want?" />
        <FieldError error={state.fieldErrors?.goal} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="fear">
          Fear
        </label>
        <Textarea className="min-h-[120px]" defaultValue={initialValues.fear ?? ""} id="fear" name="fear" placeholder="What are they avoiding?" />
        <FieldError error={state.fieldErrors?.fear} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="secret">
          Secret
        </label>
        <Textarea className="min-h-[120px]" defaultValue={initialValues.secret ?? ""} id="secret" name="secret" placeholder="Hidden truth, reveal timing, leverage..." />
        <FieldError error={state.fieldErrors?.secret} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="notes">
          Review notes
        </label>
        <Textarea defaultValue={initialValues.notes ?? ""} id="notes" name="notes" placeholder="Detection issues, alias merge notes, continuity notes, unresolved questions..." />
        <FieldError error={state.fieldErrors?.notes} />
      </div>

      <div className="md:col-span-2 space-y-4">
        <FormFeedback message={state.message} tone={state.status === "success" ? "success" : "error"} />
        <Button disabled={isPending} size="lg" type="submit">
          {mode === "create" ? (isPending ? "Creating..." : "Create character") : isPending ? "Saving..." : "Save character"}
        </Button>
      </div>
    </form>
  );
}
