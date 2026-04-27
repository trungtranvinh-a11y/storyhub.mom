"use client";

import { LoaderCircle, LogIn } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";

export function LoginForm({ callbackUrl = "/app/projects" }: { callbackUrl?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (!result || result.error) {
        setError("Incorrect email or password.");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    });
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="email">
          Email
        </label>
        <Input autoComplete="email" id="email" name="email" placeholder="writer@storyforge.io" required type="email" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-[var(--color-ink)]" htmlFor="password">
          Password
        </label>
        <Input
          autoComplete="current-password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </div>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? <LoaderCircle className="size-4 animate-spin" /> : <LogIn className="size-4" />}
        Sign in
      </Button>

      <p className="text-sm text-[var(--color-muted)]">
        Need a new account?{" "}
        <Link className="font-semibold text-[var(--color-ink)] underline-offset-4 hover:underline" href="/register">
          Register here
        </Link>
        .
      </p>
    </form>
  );
}
