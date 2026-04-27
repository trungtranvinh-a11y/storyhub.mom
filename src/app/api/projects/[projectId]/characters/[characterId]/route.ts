import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserOrNull } from "@/modules/auth/server/require-user";
import { deleteCharacterForProject, getCharacterForProject, updateCharacterForProject } from "@/services/character-service";
import { characterUpdateSchema } from "@/validation/character-schemas";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string; characterId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, characterId } = await params;
  const result = await getCharacterForProject(user.id, projectId, characterId);

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; characterId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId, characterId } = await params;
    const payload = await request.json();
    const input = characterUpdateSchema.parse(payload);
    const character = await updateCharacterForProject(user.id, projectId, characterId, input);

    if (!character) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ character });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update character." }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ projectId: string; characterId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, characterId } = await params;
  const result = await deleteCharacterForProject(user.id, projectId, characterId);

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
