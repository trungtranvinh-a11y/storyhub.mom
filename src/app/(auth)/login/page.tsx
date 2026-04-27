import { AuthCard } from "@/modules/auth/components/auth-card";
import { LoginForm } from "@/modules/auth/components/login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    returnTo?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_520px]">
        <div className="hidden rounded-[32px] border border-white/60 bg-[rgba(38,30,22,0.96)] p-10 text-white shadow-[0_22px_80px_-34px_rgba(38,30,22,0.72)] lg:block">
          <p className="text-xs uppercase tracking-[0.3em] text-[rgba(241,223,193,0.7)]">Return to the manuscript</p>
          <h2 className="mt-5 max-w-md font-serif text-5xl leading-[0.95]">
            Pick up the story with the same structure you left behind.
          </h2>
          <div className="mt-8 space-y-5 text-sm leading-7 text-[rgba(241,223,193,0.8)]">
            <p>Protected routes keep the workspace private, while the project shell stays consistent across every planning module.</p>
            <p>Phase 1 focuses on the foundation so later modules can plug into auth, authorization, and the shared layout cleanly.</p>
          </div>
        </div>

        <AuthCard
          description="Use your account to access the protected writing workspace. Project-specific modules will inherit the same authorization rules."
          eyebrow="Author Login"
          switchCopy="New here?"
          switchHref="/register"
          switchLabel="Create an account"
          title="Sign back in"
        >
          <LoginForm callbackUrl={params.returnTo ?? "/app/projects"} />
        </AuthCard>
      </div>
    </main>
  );
}
