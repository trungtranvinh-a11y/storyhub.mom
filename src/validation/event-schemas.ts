import { z } from "zod";

import { optionalTrimmedString, requiredTrimmedString } from "@/validation/helpers";

export const eventSchema = z.object({
  title: requiredTrimmedString(2, 180, "Title must be at least 2 characters."),
  chapterId: optionalTrimmedString(191),
  description: optionalTrimmedString(2000),
  timeMarker: optionalTrimmedString(160),
  consequence: optionalTrimmedString(2000),
  notes: optionalTrimmedString(4000),
  characterIds: z.array(z.string().trim().min(1)).default([]),
});

export type EventInput = z.infer<typeof eventSchema>;
