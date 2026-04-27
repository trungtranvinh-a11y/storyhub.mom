import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserOrNull } from "@/modules/auth/server/require-user";
import { createPlotThreadForProject, listPlotThreadsForProject } from "@/services/plot-thread-service";
import { plotThreadSchema } from "@/validation/plot-thread-schemas";

export async function GET(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const result = await listPlotThreadsForProject(user.id, projectId);

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function POST(request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    const payload = await request.json();
    const input = plotThreadSchema.parse(payload);
    const plotThread = await createPlotThreadForProject(user.id, projectId, input);

    if (!plotThread) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ plotThread }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create plot thread." }, { status: 500 });
  }
}
