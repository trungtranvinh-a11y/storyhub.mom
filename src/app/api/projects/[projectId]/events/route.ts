import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserOrNull } from "@/modules/auth/server/require-user";
import { createEventForProject, listEventsForProject } from "@/services/event-service";
import { eventSchema } from "@/validation/event-schemas";

export async function GET(_: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const result = await listEventsForProject(user.id, projectId);

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
    const input = eventSchema.parse(payload);
    const event = await createEventForProject(user.id, projectId, input);

    if (!event) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    return NextResponse.json({ error: "Unable to create event." }, { status: 500 });
  }
}
