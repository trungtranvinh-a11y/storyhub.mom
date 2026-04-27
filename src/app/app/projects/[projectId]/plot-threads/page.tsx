import { notFound } from "next/navigation";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { deletePlotThreadAction } from "@/modules/plot-threads/actions/plot-thread-actions";
import { PlotThreadForm, PlotThreadStatusBadge } from "@/modules/plot-threads/components/plot-thread-form";
import { listPlotThreadsForProject } from "@/services/plot-thread-service";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default async function PlotThreadsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const result = await listPlotThreadsForProject(user.id, projectId);

  if (!result) {
    notFound();
  }

  return (
    <WorkspacePage
      actions={<Badge>{result.plotThreads.length} threads</Badge>}
      description="Plot threads stay available as a manual tracking tool for unresolved arcs, clues, mysteries, and character lines discovered during review."
      eyebrow="Plot Thread Tracking"
      title="Plot Threads"
    >
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Create tracking thread</p>
          <h3 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">New thread</h3>
          <div className="mt-6">
            <PlotThreadForm
              initialValues={{
                title: "",
                description: "",
                status: "ACTIVE",
                notes: "",
              }}
              mode="create"
              projectId={projectId}
            />
          </div>
        </Card>

        <div className="space-y-5">
          {result.plotThreads.length ? (
            result.plotThreads.map((plotThread) => (
              <Card key={plotThread.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <PlotThreadStatusBadge status={plotThread.status} />
                      <Badge>{plotThread._count.chapters} chapter links</Badge>
                    </div>
                    <h3 className="text-2xl font-semibold text-[var(--color-ink)]">{plotThread.title}</h3>
                  </div>
                  <form action={deletePlotThreadAction.bind(null, projectId, plotThread.id)}>
                    <Button className="bg-rose-600 text-white hover:bg-rose-700" size="sm" type="submit">
                      Delete
                    </Button>
                  </form>
                </div>

                <div className="mt-5">
                  <PlotThreadForm
                    initialValues={{
                      title: plotThread.title,
                      description: plotThread.description,
                      status: plotThread.status,
                      notes: plotThread.notes,
                    }}
                    mode="update"
                    plotThreadId={plotThread.id}
                    projectId={projectId}
                  />
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <p className="text-sm leading-6 text-[var(--color-muted)]">No plot threads yet. Create the first unresolved story thread from the left panel.</p>
            </Card>
          )}
        </div>
      </div>
    </WorkspacePage>
  );
}
