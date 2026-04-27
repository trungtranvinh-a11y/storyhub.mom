import { notFound } from "next/navigation";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { deleteEventAction } from "@/modules/timeline/actions/event-actions";
import { EventForm } from "@/modules/timeline/components/event-form";
import { listEventsForProject } from "@/services/event-service";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

export default async function TimelinePage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const result = await listEventsForProject(user.id, projectId);

  if (!result) {
    notFound();
  }

  return (
    <WorkspacePage
      actions={<Badge>{result.events.length} events</Badge>}
      description="Timeline events act as tracked story beats. Imported drafts appear here first, then you can refine titles, timing, consequences, and linked characters."
      eyebrow="Timeline Review"
      title="Story Timeline"
    >
      <div className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-muted)]">Manual event entry</p>
          <h3 className="mt-3 font-serif text-3xl text-[var(--color-ink)]">New timeline event</h3>
          <div className="mt-6">
            <EventForm
              chapterOptions={result.chapters}
              characterOptions={result.characters}
              initialValues={{
                title: "",
                chapterId: "",
                description: "",
                timeMarker: "",
                consequence: "",
                notes: "",
              }}
              linkedCharacterIds={[]}
              mode="create"
              projectId={projectId}
            />
          </div>
        </Card>

        <div className="space-y-5">
          {result.events.length ? (
            result.events.map((event) => (
              <Card key={event.id}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      {event.isDraft ? <Badge>Draft</Badge> : null}
                      {event.timeMarker ? <Badge>{event.timeMarker}</Badge> : null}
                      {event.chapter ? <Badge>{`Chapter ${event.chapter.orderIndex}`}</Badge> : null}
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--color-ink)]">{event.title}</h3>
                    <p className="text-sm leading-6 text-[var(--color-muted)]">
                      {event.description ?? "No description yet."}
                    </p>
                    {event.detectionSource ? <p className="text-sm text-[var(--color-muted)]">Source: {event.detectionSource}</p> : null}
                  </div>
                  <form action={deleteEventAction.bind(null, projectId, event.id)}>
                    <Button className="bg-rose-600 text-white hover:bg-rose-700" size="sm" type="submit">
                      Delete
                    </Button>
                  </form>
                </div>

                <div className="mt-5">
                  <EventForm
                    chapterOptions={result.chapters}
                    characterOptions={result.characters}
                    eventId={event.id}
                    initialValues={{
                      title: event.title,
                      chapterId: event.chapterId,
                      description: event.description,
                      timeMarker: event.timeMarker,
                      consequence: event.consequence,
                      notes: event.notes,
                    }}
                    linkedCharacterIds={event.characters.map((link) => link.character.id)}
                    mode="update"
                    projectId={projectId}
                  />
                </div>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <p className="text-sm leading-6 text-[var(--color-muted)]">No events yet. Imported event drafts and manual entries will both appear here.</p>
            </Card>
          )}
        </div>
      </div>
    </WorkspacePage>
  );
}
