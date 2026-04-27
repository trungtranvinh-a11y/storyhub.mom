import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { registerUser } from "@/services/auth-service";
import { registerSchema } from "@/validation/auth-schemas";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const input = registerSchema.parse(payload);
    const user = await registerUser(input);

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      return NextResponse.json(
        {
          error: issue?.message ?? "Validation failed.",
        },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Unexpected error while creating account.",
      },
      { status: 500 },
    );
  }
}
