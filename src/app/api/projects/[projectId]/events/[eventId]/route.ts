import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserOrNull } from "@/modules/auth/server/require-user";
import { deleteEventForProject, updateEventForProject } from "@/services/event-service";
import { eventSchema } from "@/validation/event-schemas";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string; eventId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId, eventId } = await params;
    const payload = await request.json();
    const input = eventSchema.parse(payload);
    const event = await updateEventForProject(user.id, projectId, eventId, input);

    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to update event." }, { status: 500 });
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ projectId: string; eventId: string }> },
) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId, eventId } = await params;
  const result = await deleteEventForProject(user.id, projectId, eventId);

  if (!result) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return new NextResponse(null, { status: 204 });
}
