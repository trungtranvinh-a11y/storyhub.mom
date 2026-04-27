import { z } from "zod";

import { optionalTrimmedString, requiredTrimmedString } from "@/validation/helpers";

export const projectStatusValues = ["PLANNING", "DRAFT", "PAUSED", "COMPLETED"] as const;

export const projectFormSchema = z.object({
  title: requiredTrimmedString(2, 120, "Title must be at least 2 characters."),
  genre: requiredTrimmedString(2, 80, "Genre must be at least 2 characters."),
  synopsis: requiredTrimmedString(20, 3000, "Synopsis must be at least 20 characters."),
  styleNotes: optionalTrimmedString(2000),
  targetAudience: optionalTrimmedString(120),
  status: z.enum(projectStatusValues).default("PLANNING"),
});

export const projectCreateSchema = projectFormSchema;
export const projectUpdateSchema = projectFormSchema;

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
