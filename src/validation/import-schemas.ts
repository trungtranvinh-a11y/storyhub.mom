import { z } from "zod";

export const supportedImportMimeTypes = [
  "text/plain",
  "text/markdown",
  "application/octet-stream",
] as const;

export const importUploadSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  mimeType: z.string().trim().max(191).optional(),
  sizeBytes: z.number().int().min(1).max(5 * 1024 * 1024),
  rawText: z.string().min(1).max(2_000_000),
});

export type ImportUploadInput = z.infer<typeof importUploadSchema>;
