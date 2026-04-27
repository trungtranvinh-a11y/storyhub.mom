import { z } from "zod";

import { optionalInteger, optionalTrimmedString, requiredTrimmedString } from "@/validation/helpers";

export const characterFormSchema = z.object({
  name: requiredTrimmedString(2, 120, "Name must be at least 2 characters."),
  alias: optionalTrimmedString(120),
  gender: optionalTrimmedString(60),
  ageFirstAppearance: optionalInteger({ min: 0, max: 10000 }),
  currentAge: optionalInteger({ min: 0, max: 10000 }),
  role: requiredTrimmedString(2, 120, "Role must be at least 2 characters."),
  personality: optionalTrimmedString(2000),
  appearance: optionalTrimmedString(2000),
  occupation: optionalTrimmedString(120),
  goal: optionalTrimmedString(1000),
  fear: optionalTrimmedString(1000),
  secret: optionalTrimmedString(1000),
  status: optionalTrimmedString(120),
  firstAppearanceChapterId: optionalTrimmedString(191),
  notes: optionalTrimmedString(4000),
});

export const characterCreateSchema = characterFormSchema;
export const characterUpdateSchema = characterFormSchema;

export type CharacterCreateInput = z.infer<typeof characterCreateSchema>;
export type CharacterUpdateInput = z.infer<typeof characterUpdateSchema>;
