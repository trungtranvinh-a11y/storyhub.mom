import { z } from "zod";

import { optionalInteger, optionalTrimmedString, requiredTrimmedString } from "@/validation/helpers";

export const chapterStatusValues = ["DRAFT", "IN_PROGRESS", "REVIEW", "FINAL"] as const;

export const chapterCreateSchema = z.object({
  title: requiredTrimmedString(2, 180, "Title must be at least 2 characters."),
  orderIndex: optionalInteger({ min: 1, max: 100000 }).refine((value) => value != null, "Order is required."),
  summary: optionalTrimmedString(2000),
  status: z.enum(chapterStatusValues).default("DRAFT"),
});

export const chapterUpdateSchema = z.object({
  title: requiredTrimmedString(2, 180, "Title must be at least 2 characters."),
  orderIndex: optionalInteger({ min: 1, max: 100000 }).refine((value) => value != null, "Order is required."),
  summary: optionalTrimmedString(2000),
  content: z.string().max(100000).default(""),
  status: z.enum(chapterStatusValues),
  timeInStory: optionalTrimmedString(160),
  notes: optionalTrimmedString(4000),
  characterIds: z.array(z.string().trim().min(1)).default([]),
});

export type ChapterCreateInput = z.infer<typeof chapterCreateSchema>;
export type ChapterUpdateInput = z.infer<typeof chapterUpdateSchema>;
