"use client";

import { useActionState } from "react";

import { idleFormState } from "@/lib/form-state";
import { createEventAction, updateEventAction } from "@/modules/timeline/actions/event-actions";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { FieldError, FormFeedback } from "@/shared/ui/form-feedback";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

type ChapterOption = {
  id: string;
  title: string;
  orderIndex: number;
};

type CharacterOption = {
  id: string;
  name: string;
  role: string;
};

export function EventForm({
  mode,
  projectId,
  eventId,
  initialValues,
  chapterOptions,
  characterOptions,
  linkedCharacterIds,
}: {
  mode: "create" | "update";
  projectId: string;
  eventId?: string;
  initialValues: {
    title: string;
    chapterId?: string | null;
    description?: string | null;
    timeMarker?: string | null;
    consequence?: string | null;
    notes?: string | null;
  };
  chapterOptions: ChapterOption[];
  characterOptions: CharacterOption[];
  linkedCharacterIds: string[];
}) {
  const action =
    mode === "create" ? createEventAction.bind(null, projectId) : updateEventAction.bind(null, projectId, eventId ?? "");
  const [state, formAction, isPending] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`event-title-${eventId ?? "new"}`}>
          Title
        </label>
        <Input defaultValue={initialValues.title} id={`event-title-${eventId ?? "new"}`} name="title" placeholder="Opening incident" />
        <FieldError error={state.fieldErrors?.title} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`event-chapter-${eventId ?? "new"}`}>
            Chapter link
          </label>
          <Select defaultValue={initialValues.chapterId ?? ""} id={`event-chapter-${eventId ?? "new"}`} name="chapterId">
            <option value="">No chapter link</option>
            {chapterOptions.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                Chapter {chapter.orderIndex}: {chapter.title}
              </option>
            ))}
          </Select>
          <FieldError error={state.fieldErrors?.chapterId} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`event-time-${eventId ?? "new"}`}>
            Time marker
          </label>
          <Input defaultValue={initialValues.timeMarker ?? ""} id={`event-time-${eventId ?? "new"}`} name="timeMarker" placeholder="Day 1" />
          <FieldError error={state.fieldErrors?.timeMarker} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`event-description-${eventId ?? "new"}`}>
          Description
        </label>
        <Textarea defaultValue={initialValues.description ?? ""} id={`event-description-${eventId ?? "new"}`} name="description" />
        <FieldError error={state.fieldErrors?.description} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`event-consequence-${eventId ?? "new"}`}>
          Consequence
        </label>
        <Textarea defaultValue={initialValues.consequence ?? ""} id={`event-consequence-${eventId ?? "new"}`} name="consequence" />
        <FieldError error={state.fieldErrors?.consequence} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`event-notes-${eventId ?? "new"}`}>
          Notes
        </label>
        <Textarea className="min-h-[140px]" defaultValue={initialValues.notes ?? ""} id={`event-notes-${eventId ?? "new"}`} name="notes" />
        <FieldError error={state.fieldErrors?.notes} />
      </div>

      <div className="space-y-3 rounded-[28px] border border-[var(--color-line)] bg-white/50 p-4">
        <p className="text-sm font-medium text-[var(--color-ink)]">Linked characters</p>
        <div className="grid gap-3">
          {characterOptions.map((character) => (
            <label className="flex items-start gap-3 rounded-2xl border border-[var(--color-line)] bg-white/70 px-4 py-3" key={character.id}>
              <input
                defaultChecked={linkedCharacterIds.includes(character.id)}
                name="characterIds"
                type="checkbox"
                value={character.id}
              />
              <div>
                <p className="font-medium text-[var(--color-ink)]">{character.name}</p>
                <Badge className="mt-2">{character.role}</Badge>
              </div>
            </label>
          ))}
        </div>
      </div>

      <FormFeedback message={state.message} tone={state.status === "success" ? "success" : "error"} />

      <Button disabled={isPending} type="submit">
        {mode === "create" ? (isPending ? "Creating..." : "Create event") : isPending ? "Saving..." : "Save event"}
      </Button>
    </form>
  );
}
