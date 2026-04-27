import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password is too long.");

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: passwordSchema,
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters.").max(80),
    email: z.email("Please enter a valid email address."),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((input) => input.password === input.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
