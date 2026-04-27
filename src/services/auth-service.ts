import bcrypt from "bcryptjs";

import { prisma } from "@/database/prisma";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/validation/auth-schemas";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
};

function toAuthUser(user: { id: string; email: string; name: string }): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function authenticateUser(input: LoginInput) {
  const parsed = loginSchema.parse(input);
  const email = normalizeEmail(parsed.email);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(parsed.password, user.passwordHash);

  if (!isPasswordValid) {
    return null;
  }

  return toAuthUser(user);
}

export async function getAuthUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user ? toAuthUser(user) : null;
}

export async function registerUser(input: RegisterInput) {
  const parsed = registerSchema.parse(input);
  const email = normalizeEmail(parsed.email);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, 12);

  const user = await prisma.user.create({
    data: {
      name: parsed.name.trim(),
      email,
      passwordHash,
    },
  });

  return toAuthUser(user);
}
