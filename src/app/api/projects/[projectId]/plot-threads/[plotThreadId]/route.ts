import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserOrNull } from "@/modules/auth/server/require-user";
import { deletePlotThreadForProject, updatePlotThreadForProject } from "@/services/plot-thread-service";
import { plotThreadSchema } from "@/validation/plot-thread-schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; plotThreadId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId, plotThreadId } = await params;
    const payload = await request.json();
    const input = plotThreadSchema.parse(payload);
    const plotThread = await updatePlotThreadForProject(user.id, projectId, plotThreadId, input);

    if (!plotThread) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ plotThread });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update plot thread." }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ projectId: string; plotThreadId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, plotThreadId } = await params;
  const result = await deletePlotThreadForProject(user.id, projectId, plotThreadId);

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
