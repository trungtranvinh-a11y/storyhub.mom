import { AuthCard } from "@/modules/auth/components/auth-card";
import { RegisterForm } from "@/modules/auth/components/register-form";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-[1440px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[520px_minmax(0,1fr)]">
        <AuthCard
          description="Create a base account for the MVP. Credentials auth is routed through a service layer so we can extend authorization without touching the UI."
          eyebrow="Start a workspace"
          switchCopy="Already registered?"
          switchHref="/login"
          switchLabel="Sign in instead"
          title="Create your account"
        >
          <RegisterForm />
        </AuthCard>

        <div className="hidden rounded-[32px] border border-white/60 bg-white/72 p-10 shadow-[0_22px_80px_-34px_rgba(38,30,22,0.35)] lg:block">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-muted)]">What Phase 1 unlocks</p>
          <h2 className="mt-5 max-w-lg font-serif text-5xl leading-[0.95] text-[var(--color-ink)]">
            A stable shell for every story project to grow inside.
          </h2>
          <div className="mt-8 grid gap-4">
            {[
              "Protected workspace routes under /app",
              "Shared top bar and sidebar navigation",
              "Auth service with validation and credential hashing",
              "Route skeletons for projects, chapters, characters, timeline, plot threads, and settings",
            ].map((item) => (
              <div className="rounded-[24px] border border-[var(--color-line)] bg-[rgba(255,255,255,0.68)] px-5 py-4 text-sm leading-6 text-[var(--color-muted)]" key={item}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
