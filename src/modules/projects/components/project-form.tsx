"use client";

import { useActionState } from "react";

import { idleFormState } from "@/lib/form-state";
import { createProjectAction, updateProjectAction } from "@/modules/projects/actions/project-actions";
import { Button } from "@/shared/ui/button";
import { FieldError, FormFeedback } from "@/shared/ui/form-feedback";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import type { projectStatusValues } from "@/validation/project-schemas";

const projectStatuses: typeof projectStatusValues = ["PLANNING", "DRAFT", "PAUSED", "COMPLETED"];

type ProjectFormValues = {
  title: string;
  genre: string;
  synopsis: string;
  styleNotes?: string | null;
  targetAudience?: string | null;
  status: (typeof projectStatuses)[number];
};

export function ProjectForm({
  mode,
  projectId,
  initialValues,
}: {
  mode: "create" | "update";
  projectId?: string;
  initialValues: ProjectFormValues;
}) {
  const action = mode === "create" ? createProjectAction : updateProjectAction.bind(null, projectId ?? "");
  const [state, formAction, isPending] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="grid gap-5 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="title">
          Title
        </label>
        <Input defaultValue={initialValues.title} id="title" name="title" placeholder="The City Beneath Winter" />
        <FieldError error={state.fieldErrors?.title} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="genre">
          Genre
        </label>
        <Input defaultValue={initialValues.genre} id="genre" name="genre" placeholder="Fantasy Mystery" />
        <FieldError error={state.fieldErrors?.genre} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="targetAudience">
          Target audience
        </label>
        <Input defaultValue={initialValues.targetAudience ?? ""} id="targetAudience" name="targetAudience" placeholder="Young Adult" />
        <FieldError error={state.fieldErrors?.targetAudience} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="status">
          Status
        </label>
        <Select defaultValue={initialValues.status} id="status" name="status">
          {projectStatuses.map((status) => (
            <option key={status} value={status}>
              {status.replaceAll("_", " ")}
            </option>
          ))}
        </Select>
        <FieldError error={state.fieldErrors?.status} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="synopsis">
          Synopsis
        </label>
        <Textarea defaultValue={initialValues.synopsis} id="synopsis" name="synopsis" placeholder="High-level summary of the story premise..." />
        <FieldError error={state.fieldErrors?.synopsis} />
      </div>

      <div className="space-y-2 md:col-span-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="styleNotes">
          Style notes
        </label>
        <Textarea className="min-h-[150px]" defaultValue={initialValues.styleNotes ?? ""} id="styleNotes" name="styleNotes" placeholder="Voice, pacing, narrative constraints..." />
        <FieldError error={state.fieldErrors?.styleNotes} />
      </div>

      <div className="md:col-span-2 space-y-4">
        <FormFeedback message={state.message} tone={state.status === "success" ? "success" : "error"} />
        <Button disabled={isPending} size="lg" type="submit">
          {mode === "create" ? (isPending ? "Creating..." : "Create project") : isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
