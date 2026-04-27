"use client";

import { useActionState } from "react";

import { idleFormState } from "@/lib/form-state";
import { createChapterAction } from "@/modules/chapters/actions/chapter-actions";
import { Button } from "@/shared/ui/button";
import { FieldError, FormFeedback } from "@/shared/ui/form-feedback";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

export function ChapterCreateForm({ projectId }: { projectId: string }) {
  const [state, formAction, isPending] = useActionState(createChapterAction.bind(null, projectId), idleFormState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="title">
          Chapter title
        </label>
        <Input id="title" name="title" placeholder="Chapter 2: Through the Hidden Gate" />
        <FieldError error={state.fieldErrors?.title} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="orderIndex">
            Order
          </label>
          <Input id="orderIndex" name="orderIndex" placeholder="2" type="number" />
          <FieldError error={state.fieldErrors?.orderIndex} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="status">
            Status
          </label>
          <Select defaultValue="DRAFT" id="status" name="status">
            <option value="DRAFT">Draft</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="REVIEW">Review</option>
            <option value="FINAL">Final</option>
          </Select>
          <FieldError error={state.fieldErrors?.status} />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="summary">
          Chapter summary
        </label>
        <Textarea className="min-h-[140px]" id="summary" name="summary" placeholder="Short summary of what this chapter covers..." />
        <FieldError error={state.fieldErrors?.summary} />
      </div>

      <FormFeedback message={state.message} tone={state.status === "success" ? "success" : "error"} />

      <Button disabled={isPending} type="submit">
        {isPending ? "Creating..." : "Create chapter"}
      </Button>
    </form>
  );
}
