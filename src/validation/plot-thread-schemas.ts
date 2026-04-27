import { z } from "zod";

import { optionalTrimmedString, requiredTrimmedString } from "@/validation/helpers";

export const plotThreadStatusValues = ["ACTIVE", "RESOLVED", "ARCHIVED"] as const;

export const plotThreadSchema = z.object({
  title: requiredTrimmedString(2, 160, "Title must be at least 2 characters."),
  description: optionalTrimmedString(2000),
  status: z.enum(plotThreadStatusValues).default("ACTIVE"),
  notes: optionalTrimmedString(4000),
});

export type PlotThreadInput = z.infer<typeof plotThreadSchema>;
