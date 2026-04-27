"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import { createErrorState, createSuccessState, type FormState, zodErrorToFormState } from "@/lib/form-state";
import { requireAuthenticatedUser } from "@/modules/auth/server/require-user";
import {
  createCharacterForProject,
  deleteCharacterForProject,
  mergeCharacterIntoProjectCharacter,
  updateCharacterForProject,
} from "@/services/character-service";
import { characterCreateSchema, characterUpdateSchema } from "@/validation/character-schemas";

function formDataToCharacterInput(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    alias: String(formData.get("alias") ?? ""),
    gender: String(formData.get("gender") ?? ""),
    ageFirstAppearance: String(formData.get("ageFirstAppearance") ?? ""),
    currentAge: String(formData.get("currentAge") ?? ""),
    role: String(formData.get("role") ?? ""),
    personality: String(formData.get("personality") ?? ""),
    appearance: String(formData.get("appearance") ?? ""),
    occupation: String(formData.get("occupation") ?? ""),
    goal: String(formData.get("goal") ?? ""),
    fear: String(formData.get("fear") ?? ""),
    secret: String(formData.get("secret") ?? ""),
    status: String(formData.get("status") ?? ""),
    firstAppearanceChapterId: String(formData.get("firstAppearanceChapterId") ?? ""),
    notes: String(formData.get("notes") ?? ""),
  };
}

export async function createCharacterAction(projectId: string, _state: FormState, formData: FormData): Promise<FormState> {
  try {
    const user = await requireAuthenticatedUser();
    const input = characterCreateSchema.parse(formDataToCharacterInput(formData));
    const character = await createCharacterForProject(user.id, projectId, input);

    if (!character) {
      return createErrorState("Project not found.");
    }

    revalidatePath(`/app/projects/${projectId}/characters`);
    redirect(`/app/projects/${projectId}/characters/${character.id}`);
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to create character.");
  }
}

export async function updateCharacterAction(
  projectId: string,
  characterId: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const user = await requireAuthenticatedUser();
    const input = characterUpdateSchema.parse(formDataToCharacterInput(formData));
    const character = await updateCharacterForProject(user.id, projectId, characterId, input);

    if (!character) {
      return createErrorState("Character not found.");
    }

    revalidatePath(`/app/projects/${projectId}/characters`);
    revalidatePath(`/app/projects/${projectId}/characters/${characterId}`);

    return createSuccessState("Character updated successfully.");
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorToFormState(error);
    }

    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to update character.");
  }
}

export async function deleteCharacterAction(projectId: string, characterId: string) {
  const user = await requireAuthenticatedUser();
  const result = await deleteCharacterForProject(user.id, projectId, characterId);

  if (!result) {
    throw new Error("Character not found.");
  }

  revalidatePath(`/app/projects/${projectId}/characters`);
  redirect(`/app/projects/${projectId}/characters`);
}

export async function mergeCharacterAction(
  projectId: string,
  sourceCharacterId: string,
  _state: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    const user = await requireAuthenticatedUser();
    const targetCharacterId = String(formData.get("targetCharacterId") ?? "").trim();

    if (!targetCharacterId) {
      return createErrorState("Choose the character record that should remain after the merge.");
    }

    const result = await mergeCharacterIntoProjectCharacter(user.id, projectId, sourceCharacterId, targetCharacterId);

    if (!result) {
      return createErrorState("Character merge target not found.");
    }

    revalidatePath(`/app/projects/${projectId}/characters`);
    revalidatePath(`/app/projects/${projectId}/characters/${sourceCharacterId}`);
    revalidatePath(`/app/projects/${projectId}/characters/${targetCharacterId}`);
    redirect(`/app/projects/${projectId}/characters/${result.id}`);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorState(error.message);
    }

    return createErrorState("Unable to merge characters.");
  }
}
