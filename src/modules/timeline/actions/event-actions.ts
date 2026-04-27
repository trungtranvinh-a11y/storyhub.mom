"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { createErrorState, createSuccessState, idleFormState, zodErrorToFormState, type FormState } from "@/lib/form-state";
import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import { createEventForProject, deleteEventForProject, updateEventForProject } from "@/services/event-service";
import { eventSchema } from "@/validation/event-schemas";

function formDataToEventInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    chapterId: String(formData.get("chapterId") ?? ""),
    description: String(formData.get("description") ?? ""),
    timeMarker: String(formData.get("timeMarker") ?? ""),
    consequence: String(formData.get("consequence") ?? ""),
    notes: String(formData.get("notes") ?? ""),
    characterIds: formData.getAll("characterIds").map(String),
  };
}

export async function createEventAction(projectId: string, currentState: FormState = idleFormState, formData: FormData): Promise<FormState> {
  try {
    void currentState;
    const user = await requireAuthenticatedUser();
    const input = eventSchema.parse(formDataToEventInput(formData));
    const event = await createEventForProject(user.id, projectId, input);

    if (!event) {
      return createErrorState("Project not found.");
    }

    revalidatePath(`/app/projects/${projectId}/timeline`);
    revalidatePath(`/app/projects/${projectId}/dashboard`);
    return createSuccessState("Timeline event created.");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to create event.");
  }
}

export async function updateEventAction(
  projectId: string,
  eventId: string,
  currentState: FormState = idleFormState,
  formData: FormData,
): Promise<FormState> {
  try {
    void currentState;
    const user = await requireAuthenticatedUser();
    const input = eventSchema.parse(formDataToEventInput(formData));
    const event = await updateEventForProject(user.id, projectId, eventId, input);

    if (!event) {
      return createErrorState("Event not found.");
    }

    revalidatePath(`/app/projects/${projectId}/timeline`);
    revalidatePath(`/app/projects/${projectId}/dashboard`);
    return createSuccessState("Timeline event updated.");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to update event.");
  }
}

export async function deleteEventAction(projectId: string, eventId: string) {
  const user = await requireAuthenticatedUser();
  const result = await deleteEventForProject(user.id, projectId, eventId);

  if (!result) {
    throw new Error("Event not found.");
  }

  revalidatePath(`/app/projects/${projectId}/timeline`);
  revalidatePath(`/app/projects/${projectId}/dashboard`);
}
