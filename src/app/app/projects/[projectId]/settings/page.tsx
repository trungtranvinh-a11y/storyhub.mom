import { notFound } from "next/navigation";

import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { ProjectForm } from "@/modules/projects/components/project-form";
import { getProjectForUser } from "@/services/project-service";
import { Card } from "@/shared/ui/card";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const user = await requireAuthenticatedUser();
  const { projectId } = await params;
  const project = await getProjectForUser(user.id, projectId);

  if (!project) {
    notFound();
  }

  return (
    <WorkspacePage
      description="Project settings are editable now through the project service layer, with updates limited to the signed-in owner's workspace."
      eyebrow="Project Settings"
      title="Settings"
    >
      <Card className="max-w-4xl">
        <ProjectForm
          initialValues={{
            title: project.title,
            genre: project.genre,
            synopsis: project.synopsis,
            styleNotes: project.styleNotes,
            targetAudience: project.targetAudience,
            status: project.status,
          }}
          mode="update"
          projectId={project.id}
        />
      </Card>
    </WorkspacePage>
  );
}
