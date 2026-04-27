"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { createErrorState, createSuccessState, idleFormState, zodErrorToFormState, type FormState } from "@/lib/form-state";
import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { createChapterForProject, updateChapterForProject } from "@/services/chapter-service";
import { chapterCreateSchema, chapterUpdateSchema } from "@/validation/chapter-schemas";

function formDataToChapterCreateInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    orderIndex: String(formData.get("orderIndex") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    status: String(formData.get("status") ?? "DRAFT"),
  };
}

function formDataToChapterUpdateInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    orderIndex: String(formData.get("orderIndex") ?? ""),
    summary: String(formData.get("summary") ?? ""),
    content: String(formData.get("content") ?? ""),
    status: String(formData.get("status") ?? "DRAFT"),
    timeInStory: String(formData.get("timeInStory") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    characterIds: formData.getAll("characterIds").map(String),
  };
}

export async function createChapterAction(projectId: string, currentState: FormState = idleFormState, formData: FormData): Promise<FormState> {
  try {
    void currentState;
    const user = await requireAuthenticatedUser();
    const input = chapterCreateSchema.parse(formDataToChapterCreateInput(formData));
    const chapter = await createChapterForProject(user.id, projectId, input);

    if (!chapter) {
      return createErrorState("Project not found.");
    }

    revalidatePath(`/app/projects/${projectId}/chapters`);
    redirect(`/app/projects/${projectId}/chapters/${chapter.id}`);
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to create chapter.");
  }
}

export async function updateChapterAction(
  projectId: string,
  chapterId: string,
  currentState: FormState = idleFormState,
  formData: FormData,
): Promise<FormState> {
  try {
    void currentState;
    const user = await requireAuthenticatedUser();
    const input = chapterUpdateSchema.parse(formDataToChapterUpdateInput(formData));
    const chapter = await updateChapterForProject(user.id, projectId, chapterId, input);

    if (!chapter) {
      return createErrorState("Chapter not found.");
    }

    revalidatePath(`/app/projects/${projectId}/chapters`);
    revalidatePath(`/app/projects/${projectId}/chapters/${chapterId}`);
    revalidatePath(`/app/projects/${projectId}/dashboard`);

    return createSuccessState("Chapter saved successfully.");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to save chapter.");
  }
}
