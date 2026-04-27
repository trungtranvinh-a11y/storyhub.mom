import { ProjectForm } from "@/modules/projects/components/project-form";
import { WorkspacePage } from "@/modules/app-shell/components/workspace-page";
import { Card } from "@/shared/ui/card";

export default function NewProjectPage() {
  return (
    <WorkspacePage
      description="Create a new story workspace with the core metadata the AI and planning modules will rely on later."
      eyebrow="Projects"
      title="New Project"
    >
      <Card className="max-w-4xl">
        <ProjectForm
          initialValues={{
            title: "",
            genre: "",
            synopsis: "",
            styleNotes: "",
            targetAudience: "",
            status: "PLANNING",
          }}
          mode="create"
        />
      </Card>
    </WorkspacePage>
  );
}
