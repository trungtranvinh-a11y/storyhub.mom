import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAuthenticatedUserOrNull } from "@/modules/auth/server/require-user";
import { listImportJobsForProject, runImportPipelineForProject } from "@/services/import-service";
import { importUploadSchema, supportedImportMimeTypes } from "@/validation/import-schemas";

function getMimeType(file: File) {
  if (file.type) {
    return file.type;
  }

  const lowerName = file.name.toLowerCase();
  if (lowerName.endsWith(".md")) {
    return "text/markdown";
  }

  return "text/plain";
}

export async function GET(_request: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const user = await getAuthenticatedUserOrNull();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { projectId } = await params;
  const result = await listImportJobsForProject(user.id, projectId);

  if (!result) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
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
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Please choose a text file to import." }, { status: 400 });
    }

    const mimeType = getMimeType(file);
    if (!supportedImportMimeTypes.includes(mimeType as (typeof supportedImportMimeTypes)[number])) {
      return NextResponse.json({ error: "Only plain text and markdown files are supported in this MVP." }, { status: 400 });
    }

    const rawText = await file.text();
    const input = importUploadSchema.parse({
      filename: file.name,
      mimeType,
      sizeBytes: file.size,
      rawText,
    });

    const result = await runImportPipelineForProject(user.id, projectId, input);

    if (!result) {
      return NextResponse.json({ error: "Project not found." }, { status: 404 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.flatten() }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unable to import this document.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
