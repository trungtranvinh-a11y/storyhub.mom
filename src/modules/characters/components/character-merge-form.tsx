"use client";

import { useActionState } from "react";

import { idleFormState } from "@/lib/form-state";
import { mergeCharacterAction } from "@/modules/characters/actions/character-actions";
import { Button } from "@/shared/ui/button";
import { FormFeedback } from "@/shared/ui/form-feedback";
import { Select } from "@/shared/ui/select";

type MergeTarget = {
  id: string;
  name: string;
  alias: string | null;
  mentionCount: number;
  isCandidate: boolean;
};

export function CharacterMergeForm({
  projectId,
  characterId,
  targets,
}: {
  projectId: string;
  characterId: string;
  targets: MergeTarget[];
}) {
  const [state, formAction, isPending] = useActionState(
    mergeCharacterAction.bind(null, projectId, characterId),
    idleFormState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="targetCharacterId">
          Keep this character record
        </label>
        <Select defaultValue="" id="targetCharacterId" name="targetCharacterId">
          <option value="">Choose a merge destination</option>
          {targets.map((target) => (
            <option key={target.id} value={target.id}>
              {target.name}
              {target.alias ? ` (${target.alias})` : ""}
              {` - ${target.mentionCount} mentions`}
              {target.isCandidate ? " - candidate" : ""}
            </option>
          ))}
        </Select>
      </div>

      <p className="text-sm leading-6 text-[var(--color-muted)]">
        Merging moves chapter links, event links, mention counts, and aliases into the selected destination, then removes
        the current record.
      </p>

      <FormFeedback message={state.message} tone={state.status === "success" ? "success" : "error"} />

      <Button disabled={isPending || !targets.length} type="submit" variant="secondary">
        {isPending ? "Merging..." : "Merge into another character"}
      </Button>
    </form>
  );
}
