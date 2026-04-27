"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { createErrorState, createSuccessState, idleFormState, zodErrorToFormState, type FormState } from "@/lib/form-state";
import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { createProjectForUser, updateProjectForUser } from "@/services/project-service";
import { projectCreateSchema, projectUpdateSchema } from "@/validation/project-schemas";

function formDataToProjectInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    genre: String(formData.get("genre") ?? ""),
    synopsis: String(formData.get("synopsis") ?? ""),
    styleNotes: String(formData.get("styleNotes") ?? ""),
    targetAudience: String(formData.get("targetAudience") ?? ""),
    status: String(formData.get("status") ?? "PLANNING"),
  };
}

export async function createProjectAction(currentState: FormState = idleFormState, formData: FormData): Promise<FormState> {
  try {
    void currentState;
    const user = await requireAuthenticatedUser();
    const input = projectCreateSchema.parse(formDataToProjectInput(formData));
    const project = await createProjectForUser(user.id, input);

    revalidatePath("/app/projects");
    redirect(`/app/projects/${project.id}/dashboard`);
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to create project.");
  }
}

export async function updateProjectAction(
  projectId: string,
  currentState: FormState = idleFormState,
  formData: FormData,
): Promise<FormState> {
  try {
    void currentState;
    const user = await requireAuthenticatedUser();
    const input = projectUpdateSchema.parse(formDataToProjectInput(formData));
    const project = await updateProjectForUser(user.id, projectId, input);

    if (!project) {
      return createErrorState("Project not found.");
    }

    revalidatePath("/app/projects");
    revalidatePath(`/app/projects/${projectId}/dashboard`);
    revalidatePath(`/app/projects/${projectId}/settings`);

    return createSuccessState("Project updated successfully.");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to update project.");
  }
}
