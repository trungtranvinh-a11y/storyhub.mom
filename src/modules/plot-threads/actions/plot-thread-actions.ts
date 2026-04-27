"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

import { createErrorState, createSuccessState, idleFormState, zodErrorToFormState, type FormState } from "@/lib/form-state";
import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import {
  createPlotThreadForProject,
  deletePlotThreadForProject,
  updatePlotThreadForProject,
} from "@/services/plot-thread-service";
import { plotThreadSchema } from "@/validation/plot-thread-schemas";

function formDataToPlotThreadInput(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "ACTIVE"),
    notes: String(formData.get("notes") ?? ""),
  };
}

export async function createPlotThreadAction(projectId: string, currentState: FormState = idleFormState, formData: FormData): Promise<FormState> {
  try {
    void currentState;
    const user = await requireAuthenticatedUser();
    const input = plotThreadSchema.parse(formDataToPlotThreadInput(formData));
    const plotThread = await createPlotThreadForProject(user.id, projectId, input);

    if (!plotThread) {
      return createErrorState("Project not found.");
    }

    revalidatePath(`/app/projects/${projectId}/plot-threads`);
    revalidatePath(`/app/projects/${projectId}/dashboard`);
    return createSuccessState("Plot thread created.");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to create plot thread.");
  }
}

export async function updatePlotThreadAction(
  projectId: string,
  plotThreadId: string,
  currentState: FormState = idleFormState,
  formData: FormData,
): Promise<FormState> {
  try {
    void currentState;
    const user = await requireAuthenticatedUser();
    const input = plotThreadSchema.parse(formDataToPlotThreadInput(formData));
    const plotThread = await updatePlotThreadForProject(user.id, projectId, plotThreadId, input);

    if (!plotThread) {
      return createErrorState("Plot thread not found.");
    }

    revalidatePath(`/app/projects/${projectId}/plot-threads`);
    revalidatePath(`/app/projects/${projectId}/dashboard`);
    return createSuccessState("Plot thread updated.");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to update plot thread.");
  }
}

export async function deletePlotThreadAction(projectId: string, plotThreadId: string) {
  const user = await requireAuthenticatedUser();
  const result = await deletePlotThreadForProject(user.id, projectId, plotThreadId);

  if (!result) {
    throw new Error("Plot thread not found.");
  }

  revalidatePath(`/app/projects/${projectId}/plot-threads`);
  revalidatePath(`/app/projects/${projectId}/dashboard`);
}
