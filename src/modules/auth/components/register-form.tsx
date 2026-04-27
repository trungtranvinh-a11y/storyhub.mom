"use client";

import { LoaderCircle, UserPlus } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

type RegisterResponse = {
  message?: string;
  error?: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    };

    startTransition(async () => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as RegisterResponse;

      if (!response.ok) {
        setError(data.error ?? "Unable to create your account.");
        return;
      }

      const loginResult = await signIn("credentials", {
        email: payload.email,
        password: payload.password,
        redirect: false,
        callbackUrl: "/app/projects",
      });

      if (!loginResult || loginResult.error) {
        router.push("/login");
        return;
      }

      router.push(loginResult.url ?? "/app/projects");
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="name">
          Display name
        </label>
        <Input autoComplete="name" id="name" name="name" placeholder="Your author name" required />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="email">
          Email
        </label>
        <Input autoComplete="email" id="email" name="email" placeholder="writer@storyforge.io" required type="email" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="password">
            Password
          </label>
          <Input
            autoComplete="new-password"
            id="password"
            name="password"
            placeholder="At least 8 characters"
            required
            type="password"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="confirmPassword">
            Confirm password
          </label>
          <Input
            autoComplete="new-password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Retype password"
            required
            type="password"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
        Create account
      </Button>

      <p className="text-sm text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link className="font-semibold text-[var(--color-ink)] underline-offset-4 hover:underline" href="/login">
          Sign in
        </Link>
        .
      </p>
    </form>
  );
}
