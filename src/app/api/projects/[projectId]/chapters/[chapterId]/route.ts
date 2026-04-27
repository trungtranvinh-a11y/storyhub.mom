import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserOrNull } from "@/modules/auth/server/require-user";
import { getChapterForProject, updateChapterForProject } from "@/services/chapter-service";
import { chapterUpdateSchema } from "@/validation/chapter-schemas";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string; chapterId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, chapterId } = await params;
  const result = await getChapterForProject(user.id, projectId, chapterId);

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; chapterId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId, chapterId } = await params;
    const payload = await request.json();
    const input = chapterUpdateSchema.parse(payload);
    const chapter = await updateChapterForProject(user.id, projectId, chapterId, input);

    if (!chapter) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ chapter });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update chapter." }, { status: 500 });
  }
}
