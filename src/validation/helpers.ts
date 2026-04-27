import { z } from "zod";

export function optionalTrimmedString(maxLength: number) {
  return z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }

      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    },
    z.string().max(maxLength).optional(),
  );
}

export function requiredTrimmedString(minLength: number, maxLength: number, message: string) {
  return z
    .string()
    .trim()
    .min(minLength, message)
    .max(maxLength, `Must be ${maxLength} characters or fewer.`);
}

export function optionalInteger({ min, max }: { min?: number; max?: number } = {}) {
  let schema = z.number().int();

  if (min != null) {
    schema = schema.min(min);
  }

  if (max != null) {
    schema = schema.max(max);
  }

  return z.preprocess((value) => {
    if (value == null || value === "") {
      return undefined;
    }

    if (typeof value === "number") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim();

      if (normalized === "") {
        return undefined;
      }

      const parsed = Number(normalized);
      return Number.isNaN(parsed) ? value : parsed;
    }

    return value;
  }, schema.optional());
}
