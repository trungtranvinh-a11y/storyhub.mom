import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserOrNull } from "@/modules/auth/server/require-user";
import { createProjectForUser, listProjectsForUser } from "@/services/project-service";
import { projectCreateSchema } from "@/validation/project-schemas";

export async function GET() {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await listProjectsForUser(user.id);
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const input = projectCreateSchema.parse(payload);
    const project = await createProjectForUser(user.id, input);

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create project." }, { status: 500 });
  }
}
