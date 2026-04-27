"use client";

import { useActionState } from "react";

import { idleFormState } from "@/lib/form-state";
import { createPlotThreadAction, updatePlotThreadAction } from "@/modules/plot-threads/actions/plot-thread-actions";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { FieldError, FormFeedback } from "@/shared/ui/form-feedback";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";

export function PlotThreadForm({
  mode,
  projectId,
  plotThreadId,
  initialValues,
}: {
  mode: "create" | "update";
  projectId: string;
  plotThreadId?: string;
  initialValues: {
    title: string;
    description?: string | null;
    status: string;
    notes?: string | null;
  };
}) {
  const action =
    mode === "create"
      ? createPlotThreadAction.bind(null, projectId)
      : updatePlotThreadAction.bind(null, projectId, plotThreadId ?? "");
  const [state, formAction, isPending] = useActionState(action, idleFormState);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`title-${plotThreadId ?? "new"}`}>
          Title
        </label>
        <Input defaultValue={initialValues.title} id={`title-${plotThreadId ?? "new"}`} name="title" placeholder="Main mystery" />
        <FieldError error={state.fieldErrors?.title} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`status-${plotThreadId ?? "new"}`}>
          Status
        </label>
        <Select defaultValue={initialValues.status} id={`status-${plotThreadId ?? "new"}`} name="status">
          <option value="ACTIVE">Active</option>
          <option value="RESOLVED">Resolved</option>
          <option value="ARCHIVED">Archived</option>
        </Select>
        <FieldError error={state.fieldErrors?.status} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`description-${plotThreadId ?? "new"}`}>
          Description
        </label>
        <Textarea defaultValue={initialValues.description ?? ""} id={`description-${plotThreadId ?? "new"}`} name="description" />
        <FieldError error={state.fieldErrors?.description} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor={`notes-${plotThreadId ?? "new"}`}>
          Notes
        </label>
        <Textarea className="min-h-[140px]" defaultValue={initialValues.notes ?? ""} id={`notes-${plotThreadId ?? "new"}`} name="notes" />
        <FieldError error={state.fieldErrors?.notes} />
      </div>

      <FormFeedback message={state.message} tone={state.status === "success" ? "success" : "error"} />

      <Button disabled={isPending} type="submit">
        {mode === "create" ? (isPending ? "Creating..." : "Create thread") : isPending ? "Saving..." : "Save thread"}
      </Button>
    </form>
  );
}

export function PlotThreadStatusBadge({ status }: { status: string }) {
  const className =
    status === "ACTIVE"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "RESOLVED"
        ? "border-sky-200 bg-sky-50 text-sky-700"
        : "border-slate-200 bg-slate-50 text-slate-700";

  return <Badge className={className}>{status.replaceAll("_", " ")}</Badge>;
}
