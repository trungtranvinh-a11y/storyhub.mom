"use client";

import { LoaderCircle, Upload } from "lucide-react";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/ui/button";
import { FormFeedback } from "@/shared/ui/form-feedback";

export function ImportUploadPanel({ projectId }: { projectId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string>();
  const [tone, setTone] = useState<"error" | "success">("success");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(undefined);

    startTransition(async () => {
      const file = fileInputRef.current?.files?.[0];

      if (!file) {
        setTone("error");
        setMessage("Choose a .txt or .md file before starting the import.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`/api/projects/${projectId}/imports`, {
        method: "POST",
        body: formData,
      });

      const payload = (await response.json()) as {
        error?: string;
        preview?: {
          chapterCount: number;
          characterCandidateCount: number;
          eventDraftCount: number;
        };
      };

      if (!response.ok) {
        setTone("error");
        setMessage(payload.error ?? "Unable to import this document.");
        return;
      }

      setTone("success");
      setMessage(
        `Import complete. Added ${payload.preview?.chapterCount ?? 0} chapters, ${payload.preview?.characterCandidateCount ?? 0} character candidates, and ${payload.preview?.eventDraftCount ?? 0} event drafts.`,
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      router.refresh();
    });
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="rounded-[24px] border border-dashed border-[var(--color-line)] bg-[rgba(255,250,241,0.76)] p-5">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="storyFile">
          Story text file
        </label>
        <input
          accept=".txt,.md,text/plain,text/markdown"
          className="mt-3 block w-full rounded-[18px] border border-[rgba(122,87,52,0.14)] bg-[rgba(255,250,241,0.92)] px-4 py-3 text-sm text-[var(--color-ink)]"
          id="storyFile"
          ref={fileInputRef}
          type="file"
        />
        <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
          MVP supports plain text and markdown imports. The pipeline will normalize the text, split chapters heuristically, and draft review data.
        </p>
      </div>

      <FormFeedback message={message} tone={tone} />

      <Button disabled={isPending} size="lg" type="submit">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {isPending ? "Importing..." : "Upload and parse"}
      </Button>
    </form>
  );
}
