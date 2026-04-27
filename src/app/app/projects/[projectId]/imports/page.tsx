import { Clock3, FileText, Upload } from "lucide-react";
import { notFound } from "next/navigation";

import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { ImportUploadPanel } from "@/modules/imports/components/import-upload-panel";
import { listImportJobsForProject } from "@/services/import-service";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";

function formatTimestamp(value: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);
}

function buildImportWarnings(job: {
  chapterCount: number;
  characterCandidateCount: number;
  eventDraftCount: number;
  status: string;
}) {
  if (job.status !== "COMPLETED") {
    return [];
  }

  const warnings: string[] = [];

  if (job.chapterCount <= 1) {
    warnings.push("Only one chapter was detected. Review the source headings or split chapters manually.");
  }

  if (job.characterCandidateCount === 0) {
    warnings.push("No character candidates were detected. This usually means the text format or naming style needs manual review.");
  }

  if (job.eventDraftCount < job.chapterCount) {
    warnings.push("Event drafts are sparse compared with chapter count. Expect manual cleanup on the timeline.");
  }

  return warnings;
}

export default async function ImportsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const result = await listImportJobsForProject(user.id, projectId);

  if (!result) {
    notFound();
  }

  return (
    <WorkspacePage
      actions={<Badge>{result.importJobs.length} imports</Badge>}
      description="Each import job keeps the source document, parsing status, and generated drafts visible so you can audit what entered the project."
      eyebrow="Import Pipeline"
      title="Import Jobs"
    >
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">New import</p>
          <h3 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">Upload source text</h3>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Import a text document, normalize it, split chapters, detect character candidates, and create first-pass event drafts for manual review.
          </p>
          <div className="mt-6">
            <ImportUploadPanel projectId={projectId} />
          </div>
        </Card>

        <div className="space-y-5">
          {result.importJobs.length ? (
            result.importJobs.map((job) => (
              <Card key={job.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <Badge>{job.status.replaceAll("_", " ")}</Badge>
                      <Badge>{job.stage.replaceAll("_", " ")}</Badge>
                    </div>
                    <div>
                      <h3 className="font-serif text-3xl text-[var(--color-ink)]">{job.filename}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                        {job.errorMessage
                          ? job.errorMessage
                          : `Generated ${job.chapterCount} chapters, ${job.characterCandidateCount} character candidates, and ${job.eventDraftCount} event drafts.`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[var(--color-muted)]">
                      <span className="inline-flex items-center gap-2">
                        <Upload className="size-4" />
                        Started {formatTimestamp(job.createdAt)}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <Clock3 className="size-4" />
                        {job.completedAt ? `Completed ${formatTimestamp(job.completedAt)}` : "Not completed yet"}
                      </span>
                      {job.sourceDocument ? (
                        <span className="inline-flex items-center gap-2">
                          <FileText className="size-4" />
                          Source saved
                        </span>
                      ) : null}
                    </div>
                    {buildImportWarnings(job).length ? (
                      <div className="space-y-2 rounded-[22px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        {buildImportWarnings(job).map((warning) => (
                          <p key={warning}>{warning}</p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <p className="text-sm leading-6 text-[var(--color-muted)]">
                No imports yet. Upload a story text file from the left panel to create the first source document and parsing job.
              </p>
            </Card>
          )}

          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Recent source documents</p>
            <div className="mt-4 space-y-3">
              {result.sourceDocuments.length ? (
                result.sourceDocuments.map((document) => (
                  <div
                    className="rounded-[22px] border border-[rgba(122,87,52,0.12)] bg-[rgba(255,250,241,0.82)] px-4 py-3"
                    key={document.id}
                  >
                    <p className="font-medium text-[var(--color-ink)]">{document.filename}</p>
                    <p className="mt-1 text-sm text-[var(--color-muted)]">Updated {formatTimestamp(document.updatedAt)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-[var(--color-muted)]">Source documents from completed imports will appear here.</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </WorkspacePage>
  );
}
