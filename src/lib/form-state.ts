import { ZodError } from "zod";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[] | undefined>;
};

export const idleFormState: FormState = {
  status: "idle",
};

export function createErrorState(message: string, fieldErrors?: FormState["fieldErrors"]): FormState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

export function createSuccessState(message: string): FormState {
  return {
    status: "success",
    message,
  };
}

export function zodErrorToFormState(error: ZodError, fallbackMessage = "Please review the highlighted fields."): FormState {
  const flattened = error.flatten();

  return {
    status: "error",
    message: fallbackMessage,
    fieldErrors: flattened.fieldErrors,
  };
}
